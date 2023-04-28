import netlifyIdentity from "netlify-identity-widget"
import { useEffect, useState } from "react"

export default function useNetlifyIdentity(): {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  login: () => void
} {
  const [isAuthenticated, setIsAuthed] = useState(false)
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)

  useEffect(() => {
    netlifyIdentity.on("login", newUser => {
      setIsAuthed(true)
      setUser(newUser)
      netlifyIdentity.close()
    })

    netlifyIdentity.on("logout", () => {
      setIsAuthed(false)
      setUser(null)
    })

    netlifyIdentity.init()
  }, [])

  return {
    isAuthenticated,
    user,
    login: () => netlifyIdentity.open(),
  }
}
