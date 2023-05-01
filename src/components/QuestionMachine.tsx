import { useState } from "react"
import styled from "styled-components"
import Turndown from "turndown"
import useNetlifyIdentity from "utils/useNetlifyIdentity"

const turndownService = new Turndown()

async function fetchSiteContent(url: string) {
  const text = await fetch(`https://cors.mrtrapidroute.com/?${url}`).then(res =>
    res.text()
  )

  const onlyRealText =
    // only keep the content of the body
    (text.match(/<body[^>]*>([\S\s]*)<\/body>/m)?.[1] ?? "")
      // filter out script and style tags
      .replace(/<script[^>]*>[\S\s]*?<\/script>/g, "")
      .replace(/<style[^>]*>[\S\s]*?<\/style>/g, "")
      // filter out all href, src, srcset, and style attributes
      .replace(/(href|src|srcset|style)="[^"]*"/g, "")
      // collapse multiple newlines into one
      .replace(/\n+/g, "\n")

  const metaDescription =
    text.match(/<meta[^>]*name="description"[^>]*>/)?.[0] ?? ""

  let markdown
  try {
    markdown = turndownService.turndown(onlyRealText)
  } catch (error) {
    markdown = onlyRealText
  }

  return `${metaDescription}\n\n${markdown}`
}

export default function QuestionMachine() {
  const { isAuthenticated, login, token } = useNetlifyIdentity()
  const [site, setSite] = useState("")
  const [demographic, setDemographic] = useState("")
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchQuestion = async () => {
    if (!isAuthenticated || !token) {
      login()
      return
    }

    if (!site || !demographic || !question) {
      setError("Please fill out all fields")
      return
    }

    console.log("TOKEN", token)

    const siteContent = await fetchSiteContent(site)

    setLoading(true)
    setError("")
    setResponse("")
    fetch(
      `/api/site-demographics?content=${siteContent}&demographic=${demographic}&question=${question}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        setLoading(false)
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((json: { prompt: string; response: string }) => {
        console.log(json)
        return setResponse(json.response)
      })
      .catch(newError => {
        setLoading(false)
        if (newError instanceof Error) setError(newError.message)
        if (newError instanceof Response) setError(newError.statusText)
        else setError("Unknown error")
      })
  }

  return (
    <div>
      <h1>Questions</h1>
      {isAuthenticated && (
        <>
          <TextInput
            type="text"
            value={site}
            onChange={e => setSite(e.target.value)}
            placeholder="Enter your site"
          />
          <TextInput
            type="text"
            value={demographic}
            onChange={e => setDemographic(e.target.value)}
            placeholder="Enter your demographic"
          />
          <TextInput
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Enter your question"
          />
        </>
      )}
      <Submit
        onClick={() => {
          fetchQuestion().catch(error_ => {
            console.error(error_)
            setError("Unknown error")
          })
        }}
        disabled={loading}
      >
        {isAuthenticated ? "Ask a question" : "Login"}
      </Submit>
      {loading && <Loading>Loading...</Loading>}
      {error && <ErrorText>{error}</ErrorText>}
      {response && <ResponseDiv>{response}</ResponseDiv>}
    </div>
  )
}

const TextInput = styled.input`
  display: block;
  border: 1px solid black;
  margin: 10px auto;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  width: 400px;

  ::placeholder {
    color: #999;
  }
`

const Submit = styled.button`
  width: 400px;
  background: #0a369d;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  font-weight: bold;
  transition: color 0.2s, background 0.2s;

  :hover {
    background: #2a52be;
    color: white;
    cursor: pointer;
  }
`

const ErrorText = styled.div`
  margin-top: 20px;
  font-size: 20px;
  color: white;
  background-color: #d8000c;
  display: block;
  padding: 10px;
  border-radius: 10px;
`

const Loading = styled(ErrorText)`
  background-color: #d9e4f5;
  color: #0a369d;
`

const ResponseDiv = styled(ErrorText)`
  background-color: #4f4f4f;
`
