import {useState, useEffect, useCallback} from "react"
import {api} from "../api"
import {useSocketContext} from "../sockets"
import {Room, EventsMap, events, User} from "../shared"
import {useUnauthContext} from "../useAuth"

export const useRoom = (id: string) => {
  const {socket} = useSocketContext()
  const [room, setRoom] = useState<Room | null | undefined>()
  const {user} = useUnauthContext()

  useEffect(() => {
    api.getRooms().then((res) => {
      const foundRoom = res.find((r) => r.id === id)
      if (foundRoom) {
        if (foundRoom.users.every((u) => u.id !== user.id)) {
          setRoom(null)
        } else setRoom(foundRoom)
      } else {
        setRoom(null)
      }
    })
  }, [])

  useEffect(() => {
    const handleUpsertRoom = (params: EventsMap["upsertRoom"]) => {
      if (params.room.id === id) {
        console.log("New room is", params.room)
        setRoom((prev) => {
          if (!prev) return params.room
          return {...prev, ...params.room}
        })
      }
    }

    socket.on(events.upsertRoom, handleUpsertRoom)

    return () => {
      socket.off(events.upsertRoom, handleUpsertRoom)
    }
  }, [socket])

  const switchTime = useCallback(
    (user: User | null) => {
      if (room)
        socket.emit(events.switchTime, {
          newUser: user?.id ?? null,
          room: room.id,
          timeOfSwitch: Date.now(),
        } satisfies EventsMap["switchTime"])
    },
    [room, socket, user]
  )
  const reorderUsers = useCallback(
    (users: User[]) => {
      users.forEach((user, i) => {
        user.order = i
      })
      if (room) {
        room.users = users
        socket.emit(events.upsertRoom, {
          room: room,
        } satisfies EventsMap["upsertRoom"])
      }
      setRoom((prev) => (prev ? {...prev, users: users} : prev))
      console.log("New order is: ", room?.users)
    },
    [room, socket, user]
  )

  const upsertRoom = useCallback((room: Room) => {
    socket.emit(events.upsertRoom, {
      room: room,
    } satisfies EventsMap["upsertRoom"])
    setRoom((prev) => (prev ? {...prev, ...room} : prev))
  }, [])

  return {room, switchTime, reorderUsers, upsertRoom}
}
