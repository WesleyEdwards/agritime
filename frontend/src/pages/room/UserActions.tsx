import {
  Dropdown,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy"
import {Room, User} from "../../shared"
import {Autorenew, Edit, Logout, MoreVert} from "@mui/icons-material"
import {useToast} from "../../components/Toast"
import {useState} from "react"
import {Dialog} from "../../components/Dialog"
import {generateRandomName} from "../../utils"
import {useUnauthContext} from "../../useAuth"
import {useNavigate} from "react-router-dom"
import {api} from "../../api"

export const UserActions = ({
  user,
  room,
  upsertRoom,
}: {
  user: User
  room: Room
  upsertRoom: (r: Room) => void
}) => {
  const toast = useToast()
  const {user: me, setUser} = useUnauthContext()

  const canSeeSome = user.id === me.id || user.anonymous
  if (!canSeeSome) {
    return (
      <div
        style={{
          width: "36px",
          height: "36px",
        }}
      ></div>
    )
  }
  return (
    <>
      <Dropdown>
        <MenuButton slots={{root: IconButton}} slotProps={{root: {size: "sm"}}}>
          <MoreVert />
        </MenuButton>
        <Menu placement="bottom-start" keepMounted>
          <EditName
            user={user}
            setName={(name: string) => {
              room.users.forEach((u) => {
                if (u.id === user.id) {
                  u.name = name
                }
              })
              upsertRoom(room)
              if (user.id === me.id) {
                setUser((prev) => ({...prev, name: name}))
              }
              toast({message: "Saved"})
            }}
            renderButton={(onClick) => (
              <MenuItem onClick={onClick}>
                <Edit />
                Name
              </MenuItem>
            )}
          />

          <LeaveTimer
            user={user}
            room={room}
            renderButton={(onClick) => (
              <MenuItem onClick={onClick} variant="soft" color="danger">
                <Logout />
                {user.id === me.id ? "Leave Timer" : "Remove"}
              </MenuItem>
            )}
          />
        </Menu>
      </Dropdown>
    </>
  )
}

export const LeaveTimer = ({
  user,
  room,
  renderButton,
}: {
  user: User
  room: Room
  renderButton: (onClick: () => void) => React.ReactNode
}) => {
  const {user: me} = useUnauthContext()
  const navigate = useNavigate()

  const handleLeave = async () => {
    try {
      await api.leaveRoom({
        roomId: room.id,
        userId: user.id,
      })

      if (me.id === user.id) {
        navigate("/landing")
      }
    } catch (err) {
      console.error("Error leaving room:", err)
    }
  }
  return renderButton(() => {
    handleLeave()
  })
}

const EditName = ({
  user,
  setName: saveName,
  renderButton,
}: {
  user: User
  setName: (n: string) => void
  renderButton: (onClick: () => void) => React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name)

  return (
    <>
      {renderButton(() => {
        setOpen(true)
      })}

      <Dialog
        title={""}
        open={open}
        setOpen={() => {
          if (name !== user.name) {
            saveName(name ?? "")
          }
          setOpen(false)
        }}
      >
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            endDecorator={
              <IconButton
                onClick={() => {
                  setName(generateRandomName())
                }}
              >
                <Autorenew />
              </IconButton>
            }
            placeholder=""
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </FormControl>
      </Dialog>
    </>
  )
}
