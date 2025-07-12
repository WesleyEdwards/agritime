import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/joy"
import {useState} from "react"
import {LeaveTimer} from "../pages/room/UserActions"
import {Room} from "../shared"
import {useUnauthContext} from "../useAuth"

export function NavDrawer({room}: {room: Room}) {
  const {user} = useUnauthContext()
  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
  }
  const {mode, setMode} = useColorScheme()

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
            <Stack direction="row" gap="1rem">
              <Typography level="h4" color="neutral">
                Agritime
              </Typography>
            </Stack>
          </Stack>

          <Stack alignItems={"center"}>
            <ButtonGroup>
              <Button
                variant={mode === "dark" ? "solid" : undefined}
                sx={{borderRadius: "100rem 0rem 0rem 100rem"}}
                onClick={() => {
                  setMode("dark")
                }}
              >
                Dark
              </Button>
              <Button
                variant={mode === "light" ? "solid" : undefined}
                sx={{borderRadius: "0rem 100rem 100rem 0rem"}}
                onClick={() => {
                  setMode("light")
                }}
              >
                Light
              </Button>
            </ButtonGroup>
          </Stack>
          <Divider sx={{marginBlock: 2}} />
          <List>
            <LeaveTimer
              user={user}
              room={room}
              renderButton={(onClick) => (
                <ListItem key={"logout"}>
                  <ListItemButton color="danger" onClick={onClick}>
                    Leave Timer
                  </ListItemButton>
                </ListItem>
              )}
            />
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
