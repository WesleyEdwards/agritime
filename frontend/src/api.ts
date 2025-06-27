import {Room, User} from "./shared"

export const api = {
  getRooms: (): Promise<Room[]> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/get-rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json()),

  joinRoom: (body: {code: string; user: User}): Promise<Room> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  createRoom: (body: {user: User}): Promise<Room> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
}
