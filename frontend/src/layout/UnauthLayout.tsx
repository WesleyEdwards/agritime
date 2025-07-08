import {Stack, Typography} from "@mui/joy"
import {Outlet, useLocation} from "react-router-dom"
import agritimeImg from "../assets/agritime.png"
import {useMemo} from "react"

export const UnAuthLayout = () => {
  const location = useLocation()

  const isLanding = useMemo(
    () => location.pathname.includes("landing") || location.pathname === "/",
    [location]
  )

  return (
    <Stack sx={{minHeight: "100vh"}}>
      {!isLanding && (
        <Stack
          direction="row"
          padding={1}
          justifyContent="space-between"
          sx={() => ({
            width: "100%",
            backgroundColor: "#101010",
          })}
        >
          <Typography level={"h1"} alignContent={"center"}>
            Agritime
          </Typography>
          <img src={agritimeImg} width="50px" height="50px" />
        </Stack>
      )}
      <Outlet />
      <div style={{flex: 1}}></div>
    </Stack>
  )
}
