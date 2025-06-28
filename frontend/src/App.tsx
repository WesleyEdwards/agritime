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
import {ToastProvider} from "./components/Toast"

export default function App() {
  const [user, setUser] = usePersistentState<User>("user-asdf", {
    name: "",
    anonymous: false,
    connected: false,
    timeRemaining: -1,
    id: crypto.randomUUID(),
  })

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <UnauthContext.Provider value={{user, setUser}}>
            <SocketContextProvider>
              <RouterProvider router={unauthRoutes} />
            </SocketContextProvider>
          </UnauthContext.Provider>
        </ToastProvider>
      </ThemeProvider>
    </CssVarsProvider>
  )
}

const theme = extendTheme({})
