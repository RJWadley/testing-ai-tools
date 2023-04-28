import { Handler } from "@netlify/functions"
import { config } from "dotenv"
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"

config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export const handler: Handler = async event => {
  const { name } = event.queryStringParameters ?? {}

  const namePrompt = name ? ` to ${name} by name` : ""

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `Say hi${namePrompt}, and generate a unique joke, one that's never been told before`,
    },
  ]

  // ask openai for a random joke. use their gpt-3.5-turbo model
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
  })

  const joke = completion.data.choices[0]?.message

  if (!joke) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sorry, I couldn't think of a joke for you`,
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: joke,
    }),
  }
}
