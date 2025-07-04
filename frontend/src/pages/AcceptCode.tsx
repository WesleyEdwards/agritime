import {useEffect, useMemo, useState} from "react"
import {api} from "../api"
import {useUnauthContext} from "../useAuth"
import {useNavigate} from "react-router-dom"
import {PageLayout} from "../layout/PageLayout"
import {
  Button,
  Card,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy"
import {Autorenew} from "@mui/icons-material"
import {generateRandomName} from "../utils"
import {events, EventsMap, Room, User} from "../shared"
import {useSocketContext} from "../sockets"

export const AcceptCode = () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  const navigate = useNavigate()
  const {socket} = useSocketContext()

  const {user, setUser} = useUnauthContext()
  const [room, setRoom] = useState<Room>()

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
    if (user.name) {
      joinRoom()
    }
  }, [decodedCode])

  useEffect(() => {
    api.getRoom({code}).then(setRoom)
  }, [code])

  const anonymousUsers = useMemo(
    () => room?.users?.filter((u) => u.anonymous) ?? [],
    [room]
  )

  const selectUser = async (user: User) => {
    if (room) {
      room.users = room.users.map((u) => {
        if (u.id === user.id) {
          u.anonymous = false
          u.connected = true
        }
        return u
      })
      setUser(user)
      socket.emit(events.upsertRoom, {
        room: room,
      } satisfies EventsMap["upsertRoom"])

      await api.joinRoom({code, user})
      navigate(`/room-home/${room.id}`)
    }
  }

  if (anonymousUsers.length > 0) {
    return (
      <PageLayout title={"Is this you?"}>
        <Stack gap={2}>
          <Typography level="body-sm">
            Someone with this name has already been added to the timer
          </Typography>

          {anonymousUsers.map((user) => (
            <Card variant="outlined" key={user.id}>
              <Stack direction="row" justifyContent={"space-between"}>
                <Typography>{user.name}</Typography>
                <Button
                  onClick={async () => {
                    selectUser(user)
                  }}
                >
                  That's Me!
                </Button>
              </Stack>
            </Card>
          ))}

          <Button
            sx={{alignSelf: "center", width: "12rem"}}
            onClick={() => {
              setRoom(undefined)
            }}
            variant="soft"
          >
            Not me
          </Button>
        </Stack>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={"Welcome"}>
      <Stack>
        <Typography sx={{my: 4}} level="body-md">
          Please enter your name to join the timer.
        </Typography>
        <Stack gap={2}>
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
              placeholder=""
              value={user.name}
              onChange={(e) => {
                setUser({...user, name: e.target.value})
              }}
            />
          </FormControl>
          <Button
            fullWidth
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
  )
}
