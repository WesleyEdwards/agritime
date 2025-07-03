import {Button, Stack, Typography} from "@mui/joy"
import {useRoom} from "../../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect} from "react"
import {PageLayout} from "../../layout/PageLayout"
import {ShareRoom} from "./ShareRoom"
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
import {useToast} from "../../components/Toast"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()

  const toast = useToast()
  const {room, switchTime, reorderUsers, upsertRoom} = useRoom(roomId || "")
  const {user: me, setUser} = useUnauthContext()

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
                          editName={
                            user.id === me.id || user.anonymous
                              ? (name) => {
                                  room.users.forEach((u) => {
                                    if (u.id === user.id) {
                                      u.name = name
                                    }
                                  })
                                  upsertRoom(room)
                                  if (user.id === me.id) {
                                    setUser((prev) => ({...prev, name: name}))
                                  }
                                  toast({
                                    message: "Saved",
                                  })
                                }
                              : undefined
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
        sx={{mt: "4rem"}}
      >
        Pass Turn!
      </Button>
    </PageLayout>
  )
}
