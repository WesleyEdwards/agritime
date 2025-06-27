import {Divider, Stack, Typography} from "@mui/joy"
import {Outlet} from "react-router-dom"
import {NavDrawer} from "./TopBar"
import {useMediaQuery} from "@mui/material"

export const AuthLayout = () => {
  const small = useIsSmallScreen()
  return (
    <Stack minHeight={"98vh"}>
      <Stack
        direction="row"
        padding={1}
        justifyContent="space-between"
        sx={() => ({
          width: "100%",
          backgroundColor: "#101010",
        })}
      >
        <Typography level={small ? "body-lg" : "h3"} alignContent={"center"}>
          My Project
        </Typography>
        <Stack direction="row" gap="2rem" alignItems="center">
          <NavDrawer />
        </Stack>
      </Stack>
      <Outlet />
      <Divider sx={{mt: "auto"}} />
    </Stack>
  )
}

export const useIsSmallScreen = () => {
  return useMediaQuery("(max-width: 600px)")
}
