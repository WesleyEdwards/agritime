import {Card, IconButton, Stack, Typography} from "@mui/joy"
import {useRoom} from "../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect} from "react"
import {PageLayout} from "../layout/PageLayout"
import {CopyAll} from "@mui/icons-material"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()

  const {room} = useRoom(roomId || "")

  useEffect(() => {
    if (!roomId || room === null) {
      navigate("/landing")
    }
  }, [roomId, room])

  if (!room) {
    return <div>Loading...</div>
  }

  return (
    <PageLayout title={"Timer"}>
      <Typography sx={{}} level="body-md">
        Send this code to your friends to join your timer: <b>{room.code}</b>
      </Typography>
      <Card
        sx={{
          p: 1,
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography sx={{color: "text.secondary"}} level={"body-sm"}>
          {location.origin}/accept-code?code={room.code}
        </Typography>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(
              `${location.origin}/accept-code?code=${room.code}`
            )
          }}
        >
          <CopyAll />
        </IconButton>
      </Card>
      <Typography sx={{mt: 2}} level="h3">
        {room.code}
      </Typography>

      <Stack>
        {room.users.map((user) => (
          <Card key={user.id} variant="outlined" sx={{p: 2, mt: 2}}>
            <Stack key={user.id} direction="row" gap={2} alignItems="center">
              <Typography>{user.name || user.id}</Typography>
            </Stack>
          </Card>
        ))}
      </Stack>
    </PageLayout>
  )
}
