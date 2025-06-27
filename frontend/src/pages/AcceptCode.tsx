import {useEffect} from "react"
import {api} from "../api"
import {useUnauthContext} from "../useAuth"
import {useNavigate} from "react-router-dom"
import {PageLayout} from "../layout/PageLayout"
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy"
import {Autorenew} from "@mui/icons-material"
import {generateRandomName} from "../utils"

export const AcceptCode = () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  const navigate = useNavigate()

  const {user, setUser} = useUnauthContext()

  if (!code) {
    return <div>No code provided</div>
  }
  const decodedCode = decodeURIComponent(code)

  const joinRoom = async () => {
    if (user.name) {
      const room = await api.joinRoom({code, user})
      navigate(`/room-home/${room.id}`)
    }
  }

  useEffect(() => {
    joinRoom()
  }, [decodedCode])

  return (
    <>
      <PageLayout title={"Welcome"}>
        <Stack>
          <Typography sx={{my: 2}} level="body-md">
            Please enter your name to join the timer.
          </Typography>
          <Stack direction="row" alignItems={"end"} gap={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                endDecorator={
                  <IconButton
                    onClick={() => {
                      setUser({...user, name: generateRandomName()})
                    }}
                  >
                    <Autorenew />
                  </IconButton>
                }
                placeholder="Your Name"
                value={user.name}
                onChange={(e) => {
                  setUser({...user, name: e.target.value})
                }}
              />
            </FormControl>
            <Button
              disabled={!user.name}
              onClick={(e) => {
                e.preventDefault()
                joinRoom()
              }}
            >
              Join Timer
            </Button>
          </Stack>
        </Stack>
      </PageLayout>
    </>
  )
}
