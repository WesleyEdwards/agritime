import {Divider, Stack} from "@mui/joy"
import {Outlet} from "react-router-dom"

export const UnAuthLayout = () => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        textAlign: "center",
        p: 2,
        display: "flex",
        maxWidth: "md",
        mx: "auto",
      }}
    >
      <Outlet />
      <div style={{flex: 1}}></div>
      {/* <Divider
        sx={{
          my: 4,
        }}
      /> */}
    </Stack>
  )
}
