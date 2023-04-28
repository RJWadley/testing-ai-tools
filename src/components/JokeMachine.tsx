import { useState } from "react"
import styled from "styled-components"
import useNetlifyIdentity from "utils/useNetlifyIdentity"

/**
 * a component with a text box asking for your name, and a button that says "tell me a joke"
 * when you click the button, it should fetch a joke from the api "/api/jokes?name={name}"  and display it
 */
export default function JokeMachine() {
  const { isAuthenticated, user, login, token } = useNetlifyIdentity()
  const [name, setName] = useState(user?.user_metadata?.full_name ?? "")
  const [joke, setJoke] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchJoke = () => {
    if (!isAuthenticated || !token) {
      login()
      return
    }

    setLoading(true)
    setError("")
    setJoke("")
    fetch(`/api/jokes?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setLoading(false)
        if (!res.ok) throw new Error(res.statusText)
        return res.text()
      })
      .then(json => setJoke(json))
      .catch(newError => {
        setLoading(false)
        if (newError instanceof Error) setError(newError.message)
      })
  }

  return (
    <div>
      <TextInput
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <Submit onClick={fetchJoke} disabled={loading}>
        {isAuthenticated ? "Tell me a joke" : "Login"}
      </Submit>
      {loading && <Loading>Loading...</Loading>}
      {error && <ErrorText>{error}</ErrorText>}
      {joke && <Joke>{joke}</Joke>}
    </div>
  )
}

const TextInput = styled.input`
  display: block;
  border: 1px solid black;
  margin: 0 auto;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  width: 200px;

  ::placeholder {
    color: #999;
  }
`

const Submit = styled.button`
  width: 200px;
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

const Joke = styled(ErrorText)`
  background-color: #4f4f4f;
`
