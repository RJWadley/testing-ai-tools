import JokeMachine from "components/JokeMachine"
import Seo from "components/Seo"

import { Filler } from "./404"

export default function IndexPage() {
  return (
    <Filler>
      <JokeMachine />
    </Filler>
  )
}

export function Head() {
  return <Seo title="Home" description="This is the homepage!" pathname="" />
}
