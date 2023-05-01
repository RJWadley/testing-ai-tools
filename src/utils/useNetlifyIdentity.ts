import { isBrowser } from "library/functions"
import netlifyIdentity from "netlify-identity-widget"
import { startTransition, useEffect, useState } from "react"

const values: {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  login: () => void
  token: string | null
} = {
  isAuthenticated: false,
  user: null,
  login: () => {
    // noop
  },
  token: null,
}

if (isBrowser()) {
  netlifyIdentity.on("login", newUser => {
    values.isAuthenticated = true
    values.token = newUser.token?.access_token ?? null
    values.user = newUser
  })

  netlifyIdentity.on("logout", () => {
    values.isAuthenticated = false
    values.token = null
    values.user = null
  })

  netlifyIdentity.init()

  values.login = () => {
    netlifyIdentity.open()
  }
}

export default function useNetlifyIdentity(): {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  login: () => void
  token: string | null
} {
  // detect when the object changes and schedule a re-render
  const [internals, setInternals] = useState(values)
  useEffect(() => {
    const listener = () => {
      setTimeout(() => {
        startTransition(() => {
          setInternals(values)
        })
      }, 1)
    }
    netlifyIdentity.on("login", listener)
    netlifyIdentity.on("logout", listener)
    return () => {
      netlifyIdentity.off("login", listener)
      netlifyIdentity.off("logout", listener)
    }
  }, [])

  return internals
}
