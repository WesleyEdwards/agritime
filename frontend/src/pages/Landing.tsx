import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {api} from "../api"
import {AccessTime} from "@mui/icons-material"
import {AutoLoadingButton} from "../components/AutoLoadingButton"
import {useToast} from "../components/Toast"
import agritimeImg from "../assets/agritime.png"
import {CreateTimer} from "./CreateTimer"

export const Landing = () => {
  return (
    <Stack
      gap={2}
      alignItems="center"
      sx={{textAlign: "center"}}
      justifyContent={"center"}
    >
      <Typography
        level="h2"
        sx={{mt: 2, color: (theme) => theme.palette.primary[400]}}
      >
        Agritime
      </Typography>
      <img src={agritimeImg} width="150px" height="150px" />

      <Typography sx={{mb: 4}} level="h4">
        A multi-player chess timer
      </Typography>

      <Typography>Create a timer to get started!</Typography>

      <CreateTimer
        renderButton={(onClick) => (
          <Button
            endDecorator={<AccessTime />}
            size="lg"
            sx={{mt: 2}}
            onClick={onClick}
          >
            New Timer
          </Button>
        )}
      />
      <Stack>
        <Divider sx={{my: 1, width: "12rem", maxWidth: "12rem"}}>Or</Divider>
      </Stack>
      <JoinRoom />
    </Stack>
  )
}

const JoinRoom = () => {
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
          sx={{width: "100%"}}
          maxWidth="400px"
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
