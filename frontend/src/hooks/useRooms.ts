import {useState, useEffect} from "react"
import {api} from "../api"
import {useSocketContext} from "../sockets"
import {Room, EventsMap, events} from "../shared"

export const useRoom = (id: string) => {
  const {socket} = useSocketContext()
  const [room, setRoom] = useState<Room | null | undefined>()

  useEffect(() => {
    api.getRooms().then((res) => {
      const foundRoom = res.find((r) => r.id === id)
      if (foundRoom) {
        setRoom(foundRoom)
      } else {
        setRoom(null)
      }
    })
  }, [])

  useEffect(() => {
    const handleUpsertRoom = (params: EventsMap["upsertRoom"]) => {
      if (params.room.id === id) {
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

  return {room}
}
