import { createContext } from "react";

export type Room = {
    _id: string,
    name: string,
    capacity: number,
}

export interface RoomContextType extends Room {
    getRoom: (_id: string) => void;
    postRoom: (room: Room) => void;
    putRoom: (_id: string, room: Room) => void;
    deleteRoom: (_id: string) => void;
    getRoomList: () => void;
    roomList: Room[];
}

export const RoomContext = createContext<RoomContextType>(
    {} as RoomContextType
);