import {
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy"
import {LeaveRoom} from "./LeaveRoom"
import {Settings} from "@mui/icons-material"
import {Room} from "../../shared"
import {useState} from "react"

export const SettingsPage = ({
  room,
  upsertRoom,
}: {
  room: Room
  upsertRoom: (r: Room) => void
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(true)
        }}
      >
        <Settings />
      </IconButton>
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
          <DialogTitle>Settings</DialogTitle>
          <DialogContent sx={{p: 1}}>
            <FormControl sx={{mt: 4}}>
              <FormLabel>Everyone starts with: </FormLabel>
              <Input
                type={"number"}
                endDecorator={"min"}
                disabled={room.users[0].timeRemaining !== room.initTime}
                value={room.initTime / 1000 / 60}
                onChange={(e) => {
                  const t = +e.target.value
                  if (typeof t === "number" && !isNaN(t)) {
                    room.initTime = t * 1000 * 60
                    room.users.forEach((user) => {
                      user.timeRemaining = t * 1000 * 60
                    })
                    upsertRoom(room)
                  }
                }}
              />
            </FormControl>

            <LeaveRoom room={room} />
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}
