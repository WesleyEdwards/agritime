import {Stack, Typography} from "@mui/joy"
import {Outlet} from "react-router-dom"
import agritimeImg from "../assets/agritime.png"

export const UnAuthLayout = () => {
  const isLanding =
    location.pathname.includes("landing") || location.pathname === "/"
  return (
    <Stack
      sx={{
        minHeight: "100vh",
      }}
    >
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
