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

  const site = await fetch(url).then(res => res.text())

  const markdown = turndownService.turndown(site)

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "assistant",
      content: markdown,
    },
    {
      role: "user",
      content: `Nice website. I belong to the following demographic: ${demographic}.`,
    },
    {
      role: "assistant",
      content: question,
    },
    {
      role: "system",
      content: "Predict what the user's answer will be:",
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
