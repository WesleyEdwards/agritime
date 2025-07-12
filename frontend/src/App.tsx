import {RouterProvider} from "react-router-dom"
import {CssBaseline, CssVarsProvider} from "@mui/joy"
import {unauthRoutes} from "./routes"
import {SocketContextProvider} from "./sockets"
import {UnauthContext, usePersistentState} from "./useAuth"
import {User} from "./shared"
import {ToastProvider} from "./components/Toast"
import theme from "./theme"

export default function App() {
  const [user, setUser] = usePersistentState<User>("user-asdf", {
    name: "",
    anonymous: false,
    connected: false,
    timeRemaining: -1,
    order: -1,
    id: crypto.randomUUID(),
  })


  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <UnauthContext.Provider value={{user, setUser}}>
          <SocketContextProvider>
            <RouterProvider router={unauthRoutes} />
          </SocketContextProvider>
        </UnauthContext.Provider>
      </ToastProvider>
    </CssVarsProvider>
  )
}
