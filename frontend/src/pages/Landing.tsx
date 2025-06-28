import {
  Button,
  Divider,
  FormControl,
  Input,
  Stack,
  Typography,
} from "@mui/joy"
import {useState} from "react"
import {useUnauthContext} from "../useAuth"
import {useNavigate} from "react-router-dom"
import {api} from "../api"
import {AccessTime} from "@mui/icons-material"
import {AutoLoadingButton} from "../components/AutoLoadingButton"
import {useToast} from "../components/Toast"

export const Landing = () => {
  const [code, setCode] = useState("")
  const {user} = useUnauthContext()
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <Stack
      gap={4}
      alignItems="center"
      sx={{textAlign: "center"}}
      justifyContent={"center"}
    >
      <Typography sx={{mt: 8, mb: 4}} level="h2">
        Welcome to Agritime!
      </Typography>

      <Typography level="h4">Create or join a timer</Typography>

      <Button
        endDecorator={<AccessTime />}
        size="lg"
        onClick={(e) => {
          e.preventDefault()
          api.createRoom({user}).then((room) => {
            navigate(`/accept-code?code=${room.code}`)
          })
        }}
      >
        New Timer
      </Button>

      <Divider>Or</Divider>

      <Stack direction="row" alignItems={"end"} gap={2}>
        <FormControl>
          <Input
            placeholder="Timer Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
        </FormControl>
        <AutoLoadingButton
          sx={{textWrap: "nowrap"}}
          size="sm"
          disabled={code.length < 5}
          onClick={async (e) => {
            e.preventDefault()
            if (!code) return
            const rooms = await api.getRooms()
            if (rooms.some((r) => r.code === code)) {
              navigate(`/accept-code?code=${code}`)
            } else {
              toast({
                color: "warning",
                message: "Incorrect Code",
              })
            }
            // api.joinRoom({code, user}).then((room) => {
            //   navigate(`/room-home/${room.id}`)
            // })
          }}
        >
          Join Timer
        </AutoLoadingButton>
      </Stack>
    </Stack>
  )
}
