import netlifyIdentity from "netlify-identity-widget"
import { useEffect, useState } from "react"

export default function useNetlifyIdentity(): {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  login: () => void
  token: string | null
} {
  const [isAuthenticated, setIsAuthed] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)

  useEffect(() => {
    netlifyIdentity.on("login", newUser => {
      setIsAuthed(true)
      setToken(newUser.token?.access_token ?? null)
      setUser(newUser)
      netlifyIdentity.close()
    })

    netlifyIdentity.on("logout", () => {
      setIsAuthed(false)
      setToken(null)
      setUser(null)
    })

    netlifyIdentity.init()
  }, [])

  return {
    isAuthenticated,
    token,
    user,
    login: () => netlifyIdentity.open(),
  }
}
