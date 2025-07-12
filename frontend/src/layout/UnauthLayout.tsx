import {Stack} from "@mui/joy"
import {Outlet} from "react-router-dom"

export const UnAuthLayout = () => {
  return (
    <Stack sx={{minHeight: "100vh"}}>
      <Outlet />
      <div style={{flex: 1}}></div>
    </Stack>
  )
}
