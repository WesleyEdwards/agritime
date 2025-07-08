import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy"
import {useState} from "react"
import {useUnauthContext} from "../useAuth"
import {useNavigate} from "react-router-dom"
import {api} from "../api"
import {AccessTime, Add} from "@mui/icons-material"
import {AutoLoadingButton} from "../components/AutoLoadingButton"
import {useToast} from "../components/Toast"
import agritimeImg from "../assets/agritime.png"
import {Dialog} from "../components/Dialog"
import {User} from "../shared"
import {RandomNameEndAdornment} from "../utils"

export const Landing = () => {
  return (
    <Stack
      gap={2}
      alignItems="center"
      sx={{textAlign: "center"}}
      justifyContent={"center"}
    >
      <Typography sx={{mt: 2}} level="h2">
        Agritime
      </Typography>
      <img src={agritimeImg} width="150px" height="150px" />

      <NewTimerButton />

      <Divider sx={{my: 4}}>Or</Divider>
      <JoinAroom />
    </Stack>
  )
}

const JoinAroom = () => {
  const [code, setCode] = useState("")
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  return (
    <>
      <Button
        variant="outlined"
        size="sm"
        onClick={() => {
          setOpen(true)
        }}
      >
        Join a timer
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} disableRestoreFocus>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            width: "100%",
          }}
          maxWidth={"400px"}
        >
          <ModalClose sx={{zIndex: 8}} />
          <DialogTitle>Timer Code</DialogTitle>
          <DialogContent sx={{p: 1}}>
            <Stack gap={2}>
              <FormControl>
                <Input
                  placeholder="ABCDE"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                  }}
                />
              </FormControl>
              <AutoLoadingButton
                sx={{textWrap: "nowrap"}}
                disabled={code.length < 5}
                onClick={async (e) => {
                  e.preventDefault()
                  if (!code) return
                  try {
                    await api.getRoom({code})
                    navigate(`/accept-code?code=${code.toUpperCase()}`)
                  } catch {
                    toast({
                      color: "warning",
                      message: "Incorrect Code",
                    })
                  }
                }}
              >
                Join Timer
              </AutoLoadingButton>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}

const NewTimerButton = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [time, setTime] = useState(20 * 1000 * 60)

  const {user, setUser} = useUnauthContext()
  const [players, setPlayers] = useState<User[]>([])

  const handleCreate = () => {
    return api
      .createRoom({
        additionalUsers: players.filter((p) => !!p.name),
        initTime: time,
      })
      .then((room) => {
        navigate(`/accept-code?code=${room.code}`)
      })
  }
  return (
    <>
      <Button
        endDecorator={<AccessTime />}
        size="lg"
        sx={{mt: 4}}
        onClick={() => {
          setOpen(true)
        }}
      >
        New Timer
      </Button>
      <Dialog
        title="New Timer"
        open={open}
        setOpen={() => {
          setPlayers([])
          setTime(20 * 1000 * 60)
        }}
      >
        <Stack gap={3}>
          <Typography>
            You can change these settings and add or remove players at any time!
          </Typography>

          <Divider />
          <FormControl>
            <FormLabel>Everyone starts with: </FormLabel>
            <Input
              type={"number"}
              endDecorator={"min"}
              value={time / 1000 / 60}
              onChange={(e) => {
                const t = +e.target.value
                if (typeof t === "number" && !isNaN(t)) {
                  setTime(t * 1000 * 60)
                }
              }}
            />
          </FormControl>

          <Stack gap={1} sx={{mb: 4}}>
            <Typography>Players:</Typography>
            <Input
              endDecorator={
                <RandomNameEndAdornment
                  setName={(name) => {
                    user.name = name
                    setUser(user)
                  }}
                />
              }
              value={user.name}
              placeholder="Me"
              onChange={(e) => {
                setUser((prev) => ({...prev, name: e.target.value}))
              }}
            />
            {players.map((player) => (
              <Input
                key={player.id}
                endDecorator={
                  <RandomNameEndAdornment
                    setName={(name) => {
                      setPlayers((prev) =>
                        prev.map((p) =>
                          p.id === player.id ? {...p, name: name} : p
                        )
                      )
                    }}
                  />
                }
                value={player.name}
                onChange={(e) => {
                  const name = e.target.value
                  setPlayers((prev) =>
                    prev.map((p) =>
                      p.id === player.id ? {...p, name: name} : p
                    )
                  )
                }}
              />
            ))}
            <Button
              endDecorator={<Add />}
              sx={{alignSelf: "flex-end"}}
              size={"sm"}
              variant="outlined"
              onClick={() => {
                setPlayers((prev) => [
                  ...prev,
                  {
                    name: "",
                    anonymous: true,
                    connected: false,
                    timeRemaining: time,
                    order: players.length,
                    id: crypto.randomUUID(),
                  },
                ])
              }}
            >
              Add Player
            </Button>
          </Stack>

          <AutoLoadingButton sx={{textWrap: "nowrap"}} onClick={handleCreate}>
            Create Timer
          </AutoLoadingButton>
        </Stack>
      </Dialog>
    </>
  )
}

// <FormControl>
//   <FormLabel>How many players?</FormLabel>
//   <Input
//     type="number"
//     endDecorator={"players"}
//     value={playerCount}
//     onChange={(e) => {
//       const t = +e.target.value
//       if (typeof t === "number" && !isNaN(t)) {
//         setPlayerCount(t)
//       }
//     }}
//   />
// </FormControl>
