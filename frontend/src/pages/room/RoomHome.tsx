import {Card, IconButton, Stack, Typography} from "@mui/joy"
import {useRoom} from "../../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useRef, useState} from "react"
import {PageLayout} from "../../layout/PageLayout"
import {ShareRoom} from "./ShareRoom"
import {Circle, Pause, PlayArrow} from "@mui/icons-material"
import {LeaveRoom} from "./LeaveRoom"
import {Spinner} from "../../components/spinner"
import {User} from "../../shared"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()

  const {room, switchTime} = useRoom(roomId || "")

  useEffect(() => {
    if (!roomId || room === null) {
      navigate("/landing")
      return
    }
  }, [roomId, room])

  if (!room) {
    return <Spinner />
  }

  return (
    <PageLayout
      title={
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography level="h2">Timer</Typography>
          <ShareRoom room={room} />
        </Stack>
      }
    >
      <Stack>
        {room.users.map((user) => (
          <UserTimer
            key={user.id}
            user={user}
            timingUser={room.timerOn === user.id}
            switchTime={switchTime}
          />
        ))}

        <LeaveRoom room={room} />
      </Stack>
    </PageLayout>
  )
}

const UserTimer = ({
  user,
  switchTime,
  timingUser,
}: {
  user: User
  timingUser: boolean
  switchTime: (user: User | null) => void
}) => {
  const [timer, setTimer] = useState<number>(user.timeRemaining)

  useInterval(() => {
    if (timingUser) {
      setTimer((prev) => prev - 1)
    }
  }, 1000)

  useEffect(() => {
    if (user.timeRemaining !== timer * 1000) {
      console.log(`Setting timer to ${user.name}`, user.timeRemaining)
      setTimer(user.timeRemaining)
    }
  }, [user.timeRemaining])

  return (
    <Card key={user.id} variant="outlined" sx={{p: 2, mt: 2}}>
      {user.connected && (
        <Circle
          sx={{
            position: "absolute",
            width: "8px",
            opacity: 0.8,
            margin: "-12px 0px 0px -12px",
          }}
          color="success"
        />
      )}
      <Stack
        key={user.id}
        direction="row"
        justifyContent={"space-between"}
        gap={2}
        alignItems="center"
      >
        <Typography>{user.name || user.id}</Typography>

        <Stack direction="row" gap={1} alignItems={"center"}>
          <Typography>{formatTime(timer)}</Typography>
          <IconButton
            onClick={() => {
              if (timingUser) {
                switchTime(null)
              } else {
                switchTime(user)
              }
            }}
          >
            {timingUser ? <Pause color="success" /> : <PlayArrow />}
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds - minutes * 60
  return `${minutes}:${
    remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`
  }`
}

const useInterval = (callback: () => void, ms: number) => {
  const cb = useRef<() => void>()

  useEffect(() => {
    console.log("CB is changing")
    cb.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      cb.current?.()
    }

    const id = setInterval(() => {
      tick()
    }, ms)

    return () => {
      clearInterval(id)
    }
  }, [ms])
}
