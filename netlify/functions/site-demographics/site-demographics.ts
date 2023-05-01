import { Handler } from "@netlify/functions"
import { config } from "dotenv"
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"

config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export const handler: Handler = async (event, context) => {
  const { content, demographic, question } = event.queryStringParameters ?? {}
  const { user } = context.clientContext ?? {}

  // if the user is not logged in, return a 401 unauthorized
  if (!user) {
    return {
      statusCode: 401,
      body: "You must be logged in to use this endpoint",
    }
  }

  if (!content) {
    return {
      statusCode: 400,
      body: "You must provide content",
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

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: content,
    },
    {
      role: "user",
      content: `Read the above website. Make up a user that first
      in the ${demographic} demographic. Make up lots of very specific 
      details about their life, as if you were writing a fanfiction. Then, 
      imagine what they would respond if you asked them, "${question}". Give this 
      imaginary persons response as a direct quote. Then, list three specific 
      things the website does to target that demographic very well, and
      three areas of improvment for targeting that demographic.
      `.replaceAll(/\s+/g, " "),
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
