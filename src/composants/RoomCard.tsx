import { HiOfficeBuilding, HiUsers } from "react-icons/hi";

export interface Salle {
    _id: string;
    name: string;
    capacity: number;
}

interface RoomCardProps {
    salle: Salle;
}

function RoomCard({ salle }: RoomCardProps) {
    return (
        <div className="card p-5 hover:border-lime/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
                    <HiOfficeBuilding className="text-lime text-xl" />
                </div>
                <h3 className="text-white font-semibold">{salle.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <HiUsers className="text-base" />
                <span>Capacité : <span className="text-gray-300 font-medium">{salle.capacity} personnes</span></span>
            </div>
        </div>
    );
}

export default RoomCard;