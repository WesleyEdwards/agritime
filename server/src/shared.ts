
export type User = {
  name: string | undefined;
  anonymous: boolean;
  connected: boolean;
  id: string;
};

export type EventsMap = {
  upsertRoom: { room: Room };
  upsertUser: { user: User };
};

export const events: { [K in keyof EventsMap]: K } = {
  upsertRoom: "upsertRoom",
  upsertUser: "upsertUser",
};

export type Room = {
  id: string;
  code: string;
  users: User[];
};
