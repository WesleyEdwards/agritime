import {
  Button,
  Dropdown,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from "@mui/joy"
import {AccessTime, Add, Logout, Settings} from "@mui/icons-material"
import {Room} from "../../shared"
import React, {useState} from "react"
import {Dialog} from "../../components/Dialog"
import {useToast} from "../../components/Toast"
import {LeaveTimer} from "./UserActions"
import {useUnauthContext} from "../../useAuth"

export const SettingsPage = ({
  room,
  upsertRoom,
}: {
  room: Room
  upsertRoom: (r: Room) => void
}) => {
  const toast = useToast()
  const {user} = useUnauthContext()

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{root: IconButton}}
          slotProps={{root: {color: "neutral"}}}
        >
          <Settings />
        </MenuButton>
        <Menu placement="bottom-end" keepMounted>
          <AddUser
            renderButton={(onClick) => (
              <MenuItem onClick={onClick}>
                <Add />
                Add People
              </MenuItem>
            )}
            save={(name) => {
              room.users.push({
                name,
                anonymous: true,
                connected: false,
                timeRemaining: room.initTime,
                order: room.users.length,
                id: crypto.randomUUID(),
              })
              upsertRoom(room)
            }}
          />
          <StartingTime
            renderButton={(onClick) => (
              <MenuItem onClick={onClick}>
                <AccessTime />
                Starting Time
              </MenuItem>
            )}
            initValue={room.initTime}
            save={(t) => {
              room.initTime = t
              room.users.forEach((user) => {
                user.timeRemaining = t
              })
              upsertRoom(room)
              toast({message: "Saved"})
            }}
          />
          <LeaveTimer
            user={user}
            room={room}
            renderButton={(onClick) => (
              <MenuItem onClick={onClick} variant="soft" color="danger">
                <Logout />
                Leave Timer
              </MenuItem>
            )}
          />
        </Menu>
      </Dropdown>
    </>
  )
}

export const StartingTime = ({
  save,
  renderButton,
  initValue,
}: {
  renderButton: (onClick: () => void) => React.ReactNode
  save: (name: number) => void
  initValue: number
}) => {
  const [time, setTime] = useState(initValue)
  const [open, setOpen] = useState(false)
  return (
    <>
      {renderButton(() => {
        setOpen(true)
      })}

      <Dialog open={open} setOpen={setOpen} title={"Time"}>
        <Stack gap={2} mt={2}>
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
          <Button
            onClick={() => {
              save(time)
              setOpen(false)
            }}
          >
            Save
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}

const AddUser = ({
  save,
  renderButton,
}: {
  renderButton: (onClick: () => void) => React.ReactNode
  save: (name: string) => void
}) => {
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  return (
    <>
      {renderButton(() => {
        setOpen(true)
      })}

      <Dialog title={"Add Person"} open={open} setOpen={setOpen}>
        <Stack gap={2}>
          <FormControl>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </FormControl>
          <Button
            onClick={() => {
              setOpen(false)
              save(name)
              setName("")
            }}
            disabled={name === ""}
          >
            Add
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}
