import netlifyIdentity from "netlify-identity-widget"

// let isAuthenticated = false
// let token: string | null = null
// let user: netlifyIdentity.User | null = null
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

export default function useNetlifyIdentity(): {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  login: () => void
  token: string | null
} {
  return values
}
