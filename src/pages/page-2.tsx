import React from "react"

import InternalLink from "components/InternalLink"
import Layout from "components/Layout"
import SEO from "components/Seo"
import { Filler } from "pages"

export default function SecondPage() {
  return (
    <Layout>
      <Filler>
        <h1>Hi from the second page</h1>
        <br />
        <InternalLink to="/">Go back to the homepage</InternalLink>
      </Filler>
      <Filler>
        <h1>Please enjoy your stay</h1>
      </Filler>
      <Filler>
        <h1>We hope you like this page</h1>
      </Filler>
    </Layout>
  )
}

export function Head() {
  return (
    <SEO
      title="Second Page"
      description="This is the second page of the site."
      pathname="page-2"
    />
  )
}
