import {
  Button,
  Card,
  CardActions,
  CardContent,
  Input,
  Stack,
  Typography,
} from "@mui/joy"
import {events, EventsMap, Room, useSocketContext} from "../sockets"
import {useEffect, useState} from "react"
import {api} from "../api"
import {useUnauthContext} from "../useAuth"

// Hook for extracting room logic
const useRooms = () => {
  const {socket} = useSocketContext()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    api.getRooms().then((res) => {
      setRooms(res)
    })
  }, [])

  useEffect(() => {
    const handleCreateRoom = (params: EventsMap["createRoom"]) => {
      setRooms((prev) => [...prev, params.room])
    }

    const handleJoinRoom = (params: EventsMap["joinRoom"]) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === params.room ? {...r, users: r.users.concat(params.user)} : r
        )
      )
    }

    const handleUpsertUser = (params: EventsMap["upsertUser"]) => {
      setRooms((prev) =>
        prev.map((r) => {
          const users = r.users.filter((user) => user.id !== params.user.id)
          if (users.length !== r.users.length) {
            return {...r, users: users.concat(params.user)}
          }
          return r
        })
      )
    }

    socket.on(events.createRoom, handleCreateRoom)
    socket.on(events.joinRoom, handleJoinRoom)
    socket.on(events.upsertUser, handleUpsertUser)

    return () => {
      socket.off(events.createRoom, handleCreateRoom)
      socket.off(events.joinRoom, handleJoinRoom)
      socket.off(events.upsertUser, handleUpsertUser)
    }
  }, [socket])

  const joinRoom = (roomId: string, user: {id: string; name: string}) => {
    socket.emit(events.joinRoom, {
      room: roomId,
      user,
    } satisfies EventsMap["joinRoom"])
  }

  const createRoom = (room: Room, user: {id: string; name: string}) => {
    socket.emit(events.createRoom, {
      room,
      user,
    } satisfies EventsMap["createRoom"])
  }

  return {rooms, joinRoom, createRoom}
}

export const Landing = () => {
  const {socket} = useSocketContext()
  const [title, setTitle] = useState("")
  const {user, setUser} = useUnauthContext()

  const {rooms, joinRoom, createRoom} = useRooms()

  return (
    <Stack
      gap={6}
      alignItems="center"
      sx={{textAlign: "center"}}
      justifyContent={"center"}
    >
      <Typography sx={{mt: 8}} level="h2">
        Welcome! Create or join a room!
      </Typography>

      <Input
        value={user.name}
        placeholder="My Name"
        onChange={(e) => {
          const newUser = {id: user.id, name: e.target.value}
          setUser(newUser)
          socket.emit(events.upsertUser, {user: newUser})
        }}
      />

      <Input
        value={title}
        placeholder="Room"
        onChange={(e) => {
          setTitle(e.target.value)
        }}
      />

      <Button
        onClick={(e) => {
          e.preventDefault()
          createRoom(
            {
              id: crypto.randomUUID(),
              name: title,
              users: [{id: user.id, name: user.name || "Anonymous"}],
            },
            {
              id: user.id,
              name: user.name || "Anonymous",
            }
          )
        }}
      >
        Create Room
      </Button>

      <Stack gap="1rem">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardContent>
              <h1>{room.name}</h1>
              <p>People:</p>
              <ul>
                {room.users.map((u) => (
                  <li key={u.id}>
                    {u.name} ({u.id})
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => {
                  socket.emit(events.joinRoom, {
                    room: room.id,
                    user: user,
                  } satisfies EventsMap["joinRoom"])
                }}
              >
                Join
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

// Creates a name for a user, "Anonymous <random animal name>"
const createUserName = () => {
  const animals = [
    "Dog",
    "Cat",
    "Rat",
    "Bat",
    "Elephant",
    "Hamster",
    "Dragon",
    "Giraffe",
    "Chinchilla",
    "Axolotl",
    "Cheetah",
    "Liger",
    "Tiger",
    "Lion",
    "Badger",
    "Possum",
    "Dire wolf",
    "Raven",
    "Racoon",
    "Panda",
    "Cockatiel",
    "Toucan",
    "Crane",
    "Frog",
    "Spider",
    "Rabbit",
    "Hare",
    "Bear",
    "Deer",
    "Horse",
    "Squirrel",
    "Mouse",
    "Boar",
    "Fox",
    "Owl",
    "Butterfly",
    "Jaguar",
    "Boa",
    "Peacock",
    "Antelope",
    "Leopard",
    "Polar bear",
    "Crocodile",
    "Pistol shrimp",
    "Eagle",
    "Magpie",
    "Whale",
    "Swan",
    "Bobcat",
    "Rattlesnake",
    "Zebra",
    "Vulture",
    "Koala",
    "Shark",
    "Octopus",
    "Squid",
    "Crab",
    "Cuttlefish",
    "Hedgehog",
    "Lizard",
    "Wildebeest",
    "Buffalo",
    "Warthog",
    "Bison",
    "Impala",
    "Pheasant",
    "Mole",
    "Chameleon",
    "Guinea pig",
    "Capybara",
    "Kangaroo",
    "Penguin",
    "Monkey",
    "Ape",
    "Snail",
    "Sandworm",
    "Jellyfish",
    "Sea Cucumber",
    "Moth",
    "Crow",
    "Donkey",
    "Wallaby",
    "Starfish",
    "Hyena",
    "Boobie",
    "Robin",
    "Hippo",
    "Rhino",
    "Cougar",
    "Cow",
    "Turtle",
    "Dingo",
    "Flamingo",
    "Coyote",
    "Fennec fox",
    "Dragon fly",
    "Porcupine",
    "Condor",
    "Kiwi",
    "Emu",
  ]
  return `Anonymous ${animals[Math.floor(Math.random() * animals.length)]}`
}
