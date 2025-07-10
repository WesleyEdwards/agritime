import {Circle, Pause, PlayArrow} from "@mui/icons-material"
import {Card, Stack, Typography, IconButton} from "@mui/joy"
import React, {useState, useEffect, useRef} from "react"
import {User} from "../../shared"
import {DraggableProvidedDragHandleProps} from "@hello-pangea/dnd"
import {animalNames} from "../../utils"
import {useUnauthContext} from "../../useAuth"

export const UserTimer = ({
  user,
  switchTime,
  timingUser,
  actions,
  dragProps,
}: {
  user: User
  timingUser: boolean
  actions: React.ReactNode
  switchTime: (user: User | null) => void
  dragProps: DraggableProvidedDragHandleProps | null
}) => {
  const [timer, setTimer] = useState<number>(user.timeRemaining)
  const {user: me} = useUnauthContext()

  useInterval(() => {
    if (timingUser) {
      setTimer((prev) => prev - 1000)
    }
  }, 1000)

  useEffect(() => {
    if (user.timeRemaining !== timer) {
      setTimer(user.timeRemaining)
    }
  }, [user.timeRemaining])

  return (
    <Card
      key={user.id}
      variant="outlined"
      sx={(theme) => ({
        p: 2,
        mt: 2,
        borderColor: timingUser
          ? theme.vars.palette.success.outlinedBorder
          : undefined,
      })}
    >
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
        gap={0}
        alignItems="center"
      >
        {actions}
        <Stack
          {...dragProps}
          direction="row"
          width="100%"
          justifyContent={"flex-start"}
          sx={{textAlign: "start"}}
        >
          <Typography>
            {(() => {
              if (user.name === "Me" && me.id !== user.id) {
                return animalNameByHash(user.id)
              }
              if (!user.name) {
                return animalNameByHash(user.id)
              }
              return user.name
            })()}
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} alignItems={"center"}>
          <Typography
            sx={{
              color: (theme) => {
                if (timer < 0) {
                  return theme.vars.palette.danger.softActiveBg
                }
                return undefined
              },
            }}
          >
            {formatTime(timer)}
          </Typography>
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

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 1000 / 60)
  const remainingSeconds = Math.floor(ms / 1000 - minutes * 60)
  return `${minutes}:${
    remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`
  }`
}

const useInterval = (callback: () => void, ms: number) => {
  const cb = useRef<() => void>()

  useEffect(() => {
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

const animalNameByHash = (s: string) => {
  let hash = 0
  for (const char of s) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0 // Constrain to 32bit integer
  }
  const idx = Math.abs(hash) % (animalNames.length - 1)

  return `Anonymous ${animalNames[idx]}`
}
