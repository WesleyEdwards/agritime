import {RouterProvider} from "react-router-dom"
import {
  CssBaseline,
  CssVarsProvider,
  extendTheme,
  ThemeProvider,
} from "@mui/joy"
import {unauthRoutes} from "./routes"
import {SocketContextProvider} from "./sockets"
import {UnauthContext, usePersistentState} from "./useAuth"
import {User} from "./shared"

export default function App() {
  const [user, setUser] = usePersistentState<User>("user", {
    name: "",
    anonymous: false,
    connected: false,
    id: crypto.randomUUID(),
  })
  console.log("user", user)

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <UnauthContext.Provider value={{user, setUser}}>
          <SocketContextProvider>
            <RouterProvider router={unauthRoutes} />
          </SocketContextProvider>
        </UnauthContext.Provider>
      </ThemeProvider>
    </CssVarsProvider>
  )
}

const theme = extendTheme({})
