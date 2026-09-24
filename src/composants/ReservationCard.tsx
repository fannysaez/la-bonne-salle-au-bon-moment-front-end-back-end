import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import type { Reservation } from "../context/ReservationContext";
import { ReservationContext } from "../context/ReservationContext";
import { HiPencil, HiTrash, HiOfficeBuilding } from "react-icons/hi";

interface ReservationCardProps {
  reservation: Reservation;
  onChange: () => void;
}

function formatDateCard(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
  const jour = jours[start.getDay()];
  const num = start.getDate();
  const m = mois[start.getMonth()];
  const startH = String(start.getHours()).padStart(2, "0");
  const startMin = String(start.getMinutes()).padStart(2, "0");
  const endH = String(end.getHours()).padStart(2, "0");
  const endMin = String(end.getMinutes()).padStart(2, "0");
  return `${jour} ${num} ${m} · ${startH}h${startMin}–${endH}h${endMin}`;
}

function getStatut(startDate: string, endDate: string) {
  const now = new Date();
  if (new Date(startDate) > now) return "avenir";
  if (new Date(endDate) < now) return "passee";
  return "encours";
}

function ReservationCard({ reservation, onChange }: ReservationCardProps) {
  const navigate = useNavigate();
  const [salleName, setSalleName] = useState("");
  const { deleteReservation } = useContext(ReservationContext);

  const statut = getStatut(reservation.startDate, reservation.endDate);

  const borderColor =
    statut === "avenir" ? "border-l-lime" :
    statut === "encours" ? "border-l-blue-400" :
    "border-l-gray-600";

  const badge =
    statut === "avenir"
      ? <span className="badge-green text-xs">À venir</span>
      : statut === "encours"
      ? <span className="bg-blue-400/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">En cours</span>
      : <span className="bg-gray-600/30 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">Passée</span>;

  useEffect(() => {
    const fetchSalle = async () => {
      const response = await fetch(`http://localhost:3000/api/rooms/${reservation.roomId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setSalleName(data.name);
    };
    fetchSalle();
  }, [reservation.roomId]);

  return (
    <div className={`card border-l-4 ${borderColor} px-5 py-4 flex items-center justify-between gap-4`}>

      <div className="flex items-center gap-4 flex-1">
        <HiOfficeBuilding className="text-lime text-xl shrink-0" />
        <div>
          <p className="text-white font-semibold">{salleName}</p>
          <p className="text-gray-400 text-sm mt-0.5">
            {formatDateCard(reservation.startDate, reservation.endDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {badge}
        <button
          onClick={() => navigate(`/reservations/${reservation._id}`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime/10 text-lime border border-lime/30 hover:bg-lime/20 transition-all text-sm font-medium"
        >
          <HiPencil /> Modifier
        </button>
        <button
          onClick={() => { deleteReservation(reservation._id); onChange(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-medium"
        >
          <HiTrash /> Supprimer
        </button>
      </div>

    </div>
  );
}

export default ReservationCard;