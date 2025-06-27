import {RouterProvider} from "react-router-dom"
import {
  CssBaseline,
  CssVarsProvider,
  extendTheme,
  ThemeProvider,
} from "@mui/joy"
import {unauthRoutes} from "./routes"
import {SocketContextProvider, User} from "./sockets"
import {UnauthContext, usePersistentState} from "./useAuth"

export default function App() {
  const [user, setUser] = usePersistentState<User>("user", {
    name: undefined,
    id: crypto.randomUUID(),
  })

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
