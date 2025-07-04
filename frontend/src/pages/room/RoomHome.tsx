import {Button, Divider, Stack, Typography} from "@mui/joy"
import {useRoom} from "../../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect} from "react"
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
import {QRCodeShare} from "./qrCode"
import {UserActions} from "./UserActions"

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
      <Divider />
      {!hasMultipleUsers && (
        <>
          <Stack gap={2} alignItems={"center"} sx={{my: "2rem"}}>
            <Typography sx={{textAlign: "center"}}>
              Share this link with your friends so they can join!
            </Typography>
            <QRCodeShare
              url={`${location.origin}/accept-code?code=${room.code}`}
            />
            <Typography level="body-sm">
              Invite Code: <b>{room.code}</b>
            </Typography>
            <ShareLink
              url={`${location.origin}/accept-code?code=${room.code}`}
              sx={{
                display: "flex",
                p: "4px",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                gap: 1,
              }}
            />
          </Stack>
        </>
      )}

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
