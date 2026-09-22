import { useState } from "react";
import { RoomContext } from "../context/RoomContext";
import type { Room } from "../context/RoomContext";

function RoomProvider({children}: { children?: React.ReactNode }) {

const [room, setRoom] = useState<Room>({} as Room);
const [roomList, setRoomList] = useState<Room[]>([]);
const url = 'http://localhost:3000/api/rooms';

async function getRoom(id:string){
    const res = await fetch(url+"/"+id);
    const data = await res.json();
    setRoom(data);
}

async function postRoom(room:Room){
    const res = await fetch(url, {
        method:'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
    });
    const data = await res.json()
}

async function putRoom(id:string, room:Room){
    const res = await fetch((url+"/"+id), {
        method:'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
    });
    const data = await res.json()
}

async function deleteRoom(id:string){
    const res = await fetch((url+"/"+id), {
        method:'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
    });
    const data = await res.json()
}

async function getRoomList(){
    const res = await fetch(url);
    const data = await res.json();
    setRoomList(data);
}

return (
<RoomContext.Provider value={{getRoom, postRoom, putRoom,deleteRoom, getRoomList,roomList,...room}}>
{children}
</RoomContext.Provider>
);
}
export default RoomProvider;