import {createBrowserRouter, Navigate} from "react-router-dom"
import {Landing} from "./pages/Landing"
import {UnAuthLayout} from "./layout/UnauthLayout"
import {AcceptCode} from "./pages/AcceptCode"
import {RoomHome} from "./pages/room/RoomHome"

export const unauthRoutes = createBrowserRouter([
  {
    path: "/",
    Component: UnAuthLayout,
    children: [
      {
        path: "landing",
        Component: Landing,
      },
      {
        path: "room-home/:roomId",
        Component: RoomHome,
      },
      {
        path: "accept-code",
        Component: AcceptCode,
      },
      {
        index: true,
        element: <Navigate to="/landing" replace />,
      },
      {path: "*", element: <Navigate to="/landing" replace />},
    ],
  },
])
