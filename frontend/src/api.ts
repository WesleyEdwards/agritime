import {Room} from "./sockets"

export const api = {
  getRooms: (): Promise<Room[]> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/getRooms`, {
      method: "GET",
    }).then((r) => r.json()),
}
