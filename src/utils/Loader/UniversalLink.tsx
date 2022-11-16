import React, { MouseEventHandler } from "react"

import { Link } from "gatsby"
import GatsbyLink from "gatsby-link"

import { Transitions } from "."
import { loadPage } from "./TransitionUtils"

interface UniversalLinkProps {
  /**
   * the page to navigate to when clicked
   */
  to: string
  /**
   * the transition to use when navigating
   */
  transition?: Transitions
  openInNewTab?: boolean
  children: React.ReactNode
  className?: string
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onClick?: MouseEventHandler
  type?: "submit"
  forwardRef?: React.Ref<
    HTMLAnchorElement & HTMLButtonElement & GatsbyLink<unknown>
  >
}

/**
 * a link that navigates when clicked, using the specified transition
 * @returns
 */
export default function UniversalLink({
  to,
  transition = undefined,
  openInNewTab = false,
  children,
  className = "",
  onMouseEnter = undefined,
  onMouseLeave = undefined,
  onClick = undefined,
  type = undefined,
  forwardRef = undefined,
}: UniversalLinkProps) {
  const handleClick: React.MouseEventHandler = e => {
    e.preventDefault()

    if (openInNewTab) {
      window.open(to, "_blank")
    } else {
      loadPage(to, transition).catch((err: string) => {
        throw new Error(err)
      })
    }
  }

  const internal = /^\/(?!\/)/.test(to)

  if (onClick || type) {
    return (
      <button
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type={type === "submit" ? "submit" : "button"}
        ref={forwardRef}
      >
        {children}
      </button>
    )
  }

  return internal ? (
    <Link
      to={to}
      onClick={handleClick}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={forwardRef}
    >
      {children}
    </Link>
  ) : (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={forwardRef}
    >
      {children}
    </a>
  )
}