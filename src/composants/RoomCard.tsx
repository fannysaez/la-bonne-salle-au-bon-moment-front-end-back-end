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
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Salle : <span className="font-medium text-gray-900">{salle.name}</span></p>
            <p className="text-sm text-gray-500">Capacité : <span className="font-medium text-gray-900">{salle.capacity}</span></p>
        </div>
    );
}

export default RoomCard;
