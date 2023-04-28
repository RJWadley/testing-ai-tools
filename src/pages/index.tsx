import JokeMachine from "components/JokeMachine"
import QuestionMachine from "components/QuestionMachine"
import Seo from "components/Seo"

import { Filler } from "./404"

export default function IndexPage() {
  return (
    <>
      <Filler>
        <QuestionMachine />
      </Filler>
      <Filler>
        <JokeMachine />
      </Filler>
    </>
  )
}

export function Head() {
  return <Seo title="Home" description="This is the homepage!" pathname="" />
}
