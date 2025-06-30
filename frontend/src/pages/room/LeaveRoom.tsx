import {Button} from "@mui/joy"
import {useNavigate} from "react-router-dom"
import {Room} from "../../shared"
import {useUnauthContext} from "../../useAuth"
import {api} from "../../api"

export const LeaveRoom = ({room}: {room: Room}) => {
  const navigate = useNavigate()
  const {user} = useUnauthContext()

  const handleLeave = async () => {
    try {
      await api.leaveRoom({
        roomId: room.id,
        userId: user.id,
      })

      navigate("/landing")
    } catch (err) {
      console.error("Error leaving room:", err)
    }
  }

  return (
    <Button
      variant="outlined"
      size="sm"
      color="danger"
      sx={{mt: 4, alignSelf: "center"}}
      onClick={handleLeave}
    >
      Leave Timer
    </Button>
  )
}
