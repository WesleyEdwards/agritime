import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy"
import {useState} from "react"
import {useUnauthContext} from "../useAuth"
import {useNavigate} from "react-router-dom"
import {api} from "../api"

export const Landing = () => {
  const [code, setCode] = useState("")
  const {user} = useUnauthContext()
  const navigate = useNavigate()

  return (
    <Stack
      gap={6}
      alignItems="center"
      sx={{textAlign: "center"}}
      justifyContent={"center"}
    >
      <Typography sx={{mt: 8}} level="h2">
        Welcome! Create or join a room!
      </Typography>

      <Stack direction="row" alignItems={"end"} gap={2}>
        <FormControl>
          <FormLabel>Timer Code</FormLabel>
          <Input
            placeholder="ABCDE"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
        </FormControl>
        <Button
          onClick={(e) => {
            e.preventDefault()
            if (!code) return
            api.joinRoom({code, user}).then((room) => {
              navigate(`/room-home/${room.id}`)
            })
          }}
        >
          Join Timer
        </Button>
      </Stack>

      <Divider>Or</Divider>

      <Button
        onClick={(e) => {
          e.preventDefault()
          api.createRoom({user}).then((room) => {
            navigate(`/accept-code?code=${room.code}`)
          })
        }}
      >
        New Timer
      </Button>
    </Stack>
  )
}
