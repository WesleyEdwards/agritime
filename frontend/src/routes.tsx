import {createBrowserRouter, Navigate} from "react-router-dom"
import {Landing} from "./pages/Landing"
import {Profile} from "./pages/Profile"
import {AuthLayout} from "./layout/AuthLayout"
import {UnAuthLayout} from "./layout/UnauthLayout"

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
        index: true,
        element: <Navigate to="/landing" replace />,
      },
      {path: "*", element: <Navigate to="/landing" replace />},
    ],
  },
])

export const authRoutes = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "profile",
        Component: Profile,
      },
      {
        index: true,
        element: <Navigate to="/profile" replace />,
      },
      {path: "*", element: <Navigate to="/profile" replace />},
    ],
  },
])
