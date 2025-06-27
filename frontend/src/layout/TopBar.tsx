import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/joy"
import {useState} from "react"
import {useNavigate} from "react-router-dom"

export function NavDrawer() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
  }

  return (
    <Box sx={{display: "flex"}}>
      <IconButton
        onClick={() => {
          setOpen(true)
        }}
      >
        <Avatar src={""} />
      </IconButton>

      <Drawer open={open} onClose={close} anchor="right">
        <Box role="presentation" onClick={close} onKeyDown={close}>
          <Stack sx={{padding: 1, mb: 2}}>
            <Typography level="h4" color="neutral">
              Week By News
            </Typography>
          </Stack>
          <List>
            {[
              ["Profile", "profile"],
            ].map((route) => (
              <ListItem key={route[0]}>
                <ListItemButton
                  selected={location.pathname.includes(route[1])}
                  onClick={() => {
                    navigate(`/${route[1]}`)
                  }}
                >
                  {route[0]}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{marginBlock: 2}} />
          <List>
            <ListItem key={"logout"}>
              <ListItemButton
                color="danger"
                onClick={() => {
                  localStorage.removeItem("my-token")
                  window.location.reload()
                }}
              >
                Logout
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}