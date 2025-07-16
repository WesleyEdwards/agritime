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
import {Add} from "@mui/icons-material"
import {AutoLoadingButton} from "../components/AutoLoadingButton"
import {Dialog} from "../components/Dialog"
import {User} from "../shared"
import {RandomNameEndAdornment} from "../utils"

export const CreateTimer = ({
  renderButton,
}: {
  renderButton: (onClick: () => void) => React.ReactElement
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [time, setTime] = useState<number | null>(20 * 1000 * 60)

  const {user, setUser} = useUnauthContext()
  const [players, setPlayers] = useState<User[]>([])

  const handleCreate = () => {
    if (!time) return
    return api
      .createRoom({
        additionalUsers: players
          .filter((p) => !!p.name)
          .map((p) => {
            p.timeRemaining = time
            return p
          }),
        initTime: time,
      })
      .then((room) => {
        if (!user.name) {
          setUser((prev) => ({...prev, name: "Me"}))
        }
        navigate(`/accept-code?code=${room.code}`)
      })
  }
  return (
    <>
      {renderButton(() => setOpen(true))}
      <Dialog
        title="New Timer"
        open={open}
        setOpen={() => {
          setPlayers([])
          setTime(20 * 1000 * 60)
          setOpen(false)
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
              value={time ? time / 1000 / 60 : ""}
              onChange={(e) => {
                const t = +e.target.value
                if (typeof t === "number" && !isNaN(t)) {
                  setTime(t * 1000 * 60)
                } else setTime(null)
              }}
            />
          </FormControl>

          <Stack gap={1} sx={{mb: 4}}>
            {/* <Typography>Players:</Typography> */}
            <FormControl>
            <FormLabel>Players: </FormLabel>
            <Input
              endDecorator={
                <RandomNameEndAdornment
                  setName={(name) => {
                    setUser((prev) => ({...prev, name}))
                  }}
                />
              }
              value={user.name}
              placeholder=""
              onChange={(e) => {
                setUser((prev) => ({...prev, name: e.target.value}))
              }}
            /></FormControl>

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
                    timeRemaining: time ?? 0,
                    order: players.length,
                    id: crypto.randomUUID(),
                  },
                ])
              }}
            >
              Add Player
            </Button>
          </Stack>

          <AutoLoadingButton
            disabled={!time}
            sx={{textWrap: "nowrap"}}
            onClick={handleCreate}
          >
            Create Timer
          </AutoLoadingButton>
        </Stack>
      </Dialog>
    </>
  )
}
