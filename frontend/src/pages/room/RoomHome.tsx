import {Button, IconButton, Stack, Typography} from "@mui/joy"
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
import {UserActions} from "./UserActions"
import {NavDrawer} from "../../layout/NavDrawer"
import {useToast} from "../../components/Toast"
import agritimeImg from "../../assets/agritime.png"
import {WelcomeDialog} from "./WelcomeDialog"
import {Add} from "@mui/icons-material"
import {AddUser} from "./AddUser"

export const RoomHome = () => {
  const {roomId} = useParams<{roomId: string}>()
  const navigate = useNavigate()
  const toast = useToast()

  const {room, switchTime, reorderUsers, upsertRoom} = useRoom(roomId || "")
  const {user: me} = useUnauthContext()

  useEffect(() => {
    if (!roomId || room === null) {
      navigate("/landing")
      return
    }
  }, [roomId, room])

  useEffect(() => {
    if (room?.timerOn === me.id) {
      toast({message: "Your turn!"})
    }
  }, [room?.timerOn])

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
    <>
      <Stack
        direction="row"
        padding={1}
        justifyContent="space-between"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.surface,
        })}
      >
        <Stack direction="row" gap="4px">
          <img style={{height: "4rem"}} src={agritimeImg}></img>
          <Typography
            level={"h1"}
            alignContent={"center"}
            sx={{color: (theme) => theme.palette.primary[400]}}
          >
            Agritime
          </Typography>
        </Stack>
        <NavDrawer room={room} />
      </Stack>

      <PageLayout
        title={
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography level="h2">Timer</Typography>
            <Stack direction="row" gap="1rem">
              <AddUser
                renderButton={(onClick) => (
                  <IconButton onClick={onClick}>
                    <Add />
                  </IconButton>
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
                    <Draggable
                      key={user.id}
                      draggableId={user.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
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

        {room.users.length > 1 ? (
          <Button
            onClick={() => {
              const current = room.users.indexOf(
                room.users.find((u) => u.id === room.timerOn) ?? room.users[0]
              )
              const idx = (current + 1) % room.users.length
              switchTime(room.users[idx])
            }}
            size="lg"
            sx={{
              mt: "4rem",
              width: "100%",
              background: (theme) =>
                room.timerOn === me.id
                  ? theme.palette.success.solidBg
                  : undefined,
              ":hover": {
                background: (theme) =>
                  room.timerOn === me.id
                    ? theme.palette.success.solidHoverBg
                    : undefined,
              },
            }}
          >
            {room.timerOn === me.id ? "Pass Turn!" : "Next"}
          </Button>
        ) : (
          <Stack>
            <ShareLink
              code={room.code}
              sx={{
                display: "flex",
                alignSelf: "center",
                mt: 8,
                p: 1,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                gap: 1,
              }}
            />
          </Stack>
        )}
      </PageLayout>
    </>
  )
}
