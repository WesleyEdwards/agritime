import {Divider, Stack, Typography} from "@mui/joy"
import {useRoom} from "../../hooks/useRooms"
import {useNavigate, useParams} from "react-router-dom"
import {useEffect} from "react"
import {PageLayout} from "../../layout/PageLayout"
import {ShareRoom} from "./ShareRoom"
import {LeaveRoom} from "./LeaveRoom"
import {Spinner} from "../../components/spinner"
import {UserTimer} from "./UserTimer"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()

  const {room, switchTime, reorderUsers} = useRoom(roomId || "")

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
          <ShareRoom room={room} />
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
                          dragProps={provided}
                          user={user}
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

      <Divider sx={{mt: "8rem"}}></Divider>
      <LeaveRoom room={room} />
    </PageLayout>
  )
}
