import {Button, Stack, Typography} from "@mui/joy"
import {useRoom} from "../../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {PageLayout} from "../../layout/PageLayout"
import {ShareLink, ShareRoom} from "./ShareRoom"
import {Spinner} from "../../components/spinner"
import {UserTimer} from "./UserTimer"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import {SettingsPage} from "./SettingsPage"
import {useUnauthContext} from "../../useAuth"
import {UserActions} from "./UserActions"
import {Dialog} from "../../components/Dialog"
import {Room} from "../../shared"
import agritimeEmoji from "../../assets/agritime-sundial-nobg.png"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()

  const {room, switchTime, reorderUsers, upsertRoom} = useRoom(roomId || "")
  const {user: me} = useUnauthContext()

  useEffect(() => {
    if (!roomId || room === null) {
      navigate("/landing")
      return
    }
  }, [roomId, room])

  if (!room) {
    return <Spinner />
  }

  const handleDragEnd = (result: DropResult) => {
    const {source, destination} = result
    if (!destination || source.index === destination.index) return

    const newOrder = Array.from(room.users)
    const [moved] = newOrder.splice(source.index, 1)
    newOrder.splice(destination.index, 0, moved)

    reorderUsers(newOrder)
  }

  const hasMultipleUsers = room.users.length > 1

  return (
    <PageLayout
      title={
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography level="h2">Timer</Typography>
          <Stack direction="row" gap="1rem">
            <SettingsPage room={room} upsertRoom={upsertRoom} />
            <ShareRoom room={room} />
          </Stack>
        </Stack>
      }
    >
      <WelcomeDialog room={room} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="userTimers">
          {(provided) => (
            <Stack ref={provided.innerRef} {...provided.droppableProps}>
              {room.users
                .sort((a, b) => {
                  if (a.order < b.order) return -1
                  return 1
                })
                .map((user, index) => (
                  <Draggable key={user.id} draggableId={user.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <UserTimer
                          dragProps={provided.dragHandleProps}
                          user={user}
                          actions={
                            <UserActions
                              user={user}
                              room={room}
                              upsertRoom={upsertRoom}
                            />
                          }
                          timingUser={room.timerOn === user.id}
                          switchTime={switchTime}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>

      {hasMultipleUsers && (
        <Button
          disabled={room.timerOn !== me.id}
          onClick={() => {
            const current = room.users.indexOf(
              room.users.find((u) => u.id === room.timerOn) ?? room.users[0]
            )
            const idx = (current + 1) % room.users.length
            switchTime(room.users[idx])
          }}
          size="lg"
          sx={{mt: "4rem", width: "100%"}}
        >
          Pass Turn!
        </Button>
      )}
    </PageLayout>
  )
}

const WelcomeDialog = ({room}: {room: Room}) => {
  const [seeState, setSeeState] = useState<"hasSeen" | "seeing" | "hasNotSeen">(
    "hasNotSeen"
  )

  useEffect(() => {
    if (
      room.users.filter((u) => u.connected).length === 1 &&
      seeState !== "hasSeen"
    ) {
      setSeeState("seeing")
    }
  }, [room.users])

  return (
    <>
      <Dialog
        open={seeState === "seeing"}
        setOpen={() => setSeeState("hasSeen")}
        title={
          <Typography
            endDecorator={
              <img src={agritimeEmoji} width={"16px"} height={"16px"} />
            }
          >
            Welcome to your timer!
          </Typography>
        }
      >
        <Stack gap={4} mt={4}>
          <Typography textAlign={"center"}>
            You can share this link so your friends can join
          </Typography>
          <ShareLink
            url={`${location.origin}/accept-code?code=${room.code}`}
            sx={{
              my: 2,
              mx: 0,
              width: "fit-content",
              display: "flex",
              p: "8px",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 1,
            }}
          />
          <Button
            onClick={() => {
              setSeeState("hasSeen")
            }}
          >
            Got it!
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}
