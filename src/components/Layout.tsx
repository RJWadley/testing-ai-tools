import BlueTransition from "components/BlueTransition"
import Footer from "components/Footer"
import GreenTransition from "components/GreenTransition"
import Header from "components/Header"
import { useBackButton } from "library/Loader/TransitionUtils"
import { useTrackPageReady } from "library/pageReady"
import Scroll from "library/Scroll"
import useCSSHeightVariables from "library/useCssHeightVariables"
import styled, { createGlobalStyle, css } from "styled-components"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useTrackPageReady()
  useBackButton()
  useCSSHeightVariables()

  return (
    <>
      <GreenTransition />
      <BlueTransition />
      <GlobalStyles />
      <Scroll>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Scroll>
    </>
  )
}

const Main = styled.main`
  overflow-x: hidden;
`

const globalStyles = css`
  * {
    font-family: sans-serif;
  }
`

const GlobalStyles = createGlobalStyle`${globalStyles}`
