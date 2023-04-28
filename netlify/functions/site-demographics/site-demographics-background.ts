import { Handler } from "@netlify/functions"
import { config } from "dotenv"
import fetch from "node-fetch"
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"
import Turndown from "turndown"

config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

const turndownService = new Turndown()

export const handler: Handler = async (event, context) => {
  const { url, demographic, question } = event.queryStringParameters ?? {}
  const { user } = context.clientContext ?? {}

  // if the user is not logged in, return a 401 unauthorized
  if (!user) {
    return {
      statusCode: 401,
      body: "You must be logged in to use this endpoint",
    }
  }

  if (!url) {
    return {
      statusCode: 400,
      body: "You must provide a url",
    }
  }
  if (!demographic) {
    return {
      statusCode: 400,
      body: "You must provide a demographic",
    }
  }
  if (!question) {
    return {
      statusCode: 400,
      body: "You must provide a question",
    }
  }

  const text = await fetch(url).then(res => res.text())

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

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `${metaDescription}\n${markdown}`,
    },
    {
      role: "user",
      content: `Read the above website. Make up a user that first
      in the ${demographic} demographic. Make up lots of very specific 
      details about their life, as if you were writing a fanfiction. They have 
      no prior knowledge of the above website. Then, imagine what they would respond if
      you asked them, "${question}". Give this imaginary persons response 
      as a direct quote.`.replaceAll(/\s+/g, " "),
    },
  ]

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
  })

  const response = completion.data.choices[0]?.message?.content

  const output = {
    prompt,
    response,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(output),
  }
}
