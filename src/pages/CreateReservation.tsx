import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../context/ReservationContext";
import { UserContext } from "../context/UserContext";
import type { User } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import type { Room } from "../context/RoomContext";
import { useNavigate, NavLink } from "react-router";
import {
  HiSearch,
  HiCheckCircle,
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
} from "react-icons/hi";
import Navbar from "../composants/NavBar";

function CreateReservation() {
  const { postReservation, getReservationList, reservationList } = useContext(ReservationContext);
  const { getRoomList, roomList } = useContext(RoomContext);
  const context = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => { getRoomList(); }, []);
  useEffect(() => { getReservationList(); }, []);

  if (!context) return null;
  const { user, userList, getUserList, logout } = context;

  useEffect(() => { getUserList(); }, []);

  const today = new Date().toISOString().split("T")[0];
  const [searchDate, setSearchDate] = useState(today);
  const [searchStart, setSearchStart] = useState("09:00");
  const [searchEnd, setSearchEnd] = useState("11:00");
  const [selectedUserId, setSelectedUserId] = useState(user?._id ?? "");
  const [searched, setSearched] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [roomPage, setRoomPage] = useState(1);
  const ROOM_PAGE_SIZE = 5;

  useEffect(() => {
    if (user) setSelectedUserId(user._id);
  }, [user]);

  // Navbar
  const navLinks = [
    { to: `/dashboard/${user?.roleLabel}`, label: "Accueil", icon: <HiHome /> },
    { to: "/viewreservation", label: "Planning", icon: <HiCalendar /> },
    { to: "/createreservation", label: "Mes réservations", icon: <HiBookOpen /> },
    ...(user?.roleLabel === "Admin"
      ? [{ to: "/roomlist", label: "Espace Admin", icon: <HiCog /> }]
      : []),
  ];

  const roleBadge = () => {
    if (user?.roleLabel === "Admin") return { icon: <HiCog />, label: "Admin" };
    if (user?.roleLabel === "Formateur") return { icon: <HiBookOpen />, label: "Formateur" };
    return { icon: <HiAcademicCap />, label: "Apprenant" };
  };
  const badge = roleBadge();

  function handleSearch() {
    setErrorForm("");
    setSuccess(false);

    if (!searchDate || !searchStart || !searchEnd) {
      setErrorForm("Veuillez remplir tous les champs");
      return;
    }

    const start = new Date(`${searchDate}T${searchStart}:00`);
    const end = new Date(`${searchDate}T${searchEnd}:00`);

    if (start >= end) {
      setErrorForm("L'heure de fin doit être après l'heure de début");
      return;
    }

    const startIso = start.toISOString();
    const endIso = end.toISOString();
    setStartDate(startIso);
    setEndDate(endIso);

    const available = roomList.filter((room) => {
      return !reservationList.some((resa) => {
        if (resa.roomId !== room._id) return false;
        return !(end <= new Date(resa.startDate) || start >= new Date(resa.endDate));
      });
    });

    setAvailableRooms(available);
      setRoomPage(1);
    setSearched(true);
  }

  function handleReserve(roomId: string) {
    const userId = selectedUserId || user?._id || "";
    if (!userId) return;
    postReservation({ roomId, userId, startDate, endDate } as Reservation);
    setSuccess(true);
    setSearched(false);
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 page-header-text">
          <p className="section-label">Planning</p>
          <h2 className="text-3xl font-bold text-white">Réserver un créneau</h2>
          <p className="text-gray-400 mt-1">Recherchez une salle disponible pour votre session</p>
        </div>

        {/* Formulaire de recherche */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-gray-400 text-sm mb-1">Date</label>
              <input
                type="date"
                className="input-field"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-gray-400 text-sm mb-1">Heure de début</label>
              <input
                type="time"
                step="3600"
                className="input-field"
                value={searchStart}
                onChange={(e) => setSearchStart(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-gray-400 text-sm mb-1">Heure de fin</label>
              <input
                type="time"
                step="3600"
                className="input-field"
                value={searchEnd}
                onChange={(e) => setSearchEnd(e.target.value)}
              />
            </div>
            {user?.roleLabel === "Admin" && (
              <div className="flex-1 min-w-[160px]">
                <label className="block text-gray-400 text-sm mb-1">Utilisateur</label>
                <select
                  className="input-field"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {userList.map((u: User) => (
                    <option key={u._id} value={u._id}>
                      {u.firstname} {u.lastname}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="search-btn-wrapper">
              <button
                onClick={handleSearch}
                className="btn-lime flex items-center gap-2 px-6 py-2.5"
              >
                <HiSearch /> Rechercher
              </button>
            </div>
          </div>
          {errorForm && (
            <p className="text-red-400 text-sm mt-3 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">
              ⚠ {errorForm}
            </p>
          )}
        </div>

        {/* Message succès */}
        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-lime/20 border border-lime/40 px-4 py-3 text-lime text-sm font-medium mb-6">
            <HiCheckCircle className="text-lg" />
            Créneau réservé avec succès !
          </div>
        )}

        {/* Résultats */}
        {searched && (
          <div className="mt-8">
            <p className="section-label mb-4">
              SALLES DISPONIBLES — {availableRooms.length} résultat{availableRooms.length !== 1 ? "s" : ""}
            </p>
            {availableRooms.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-gray-400">Aucune salle disponible pour ce créneau</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {availableRooms.slice((roomPage - 1) * ROOM_PAGE_SIZE, roomPage * ROOM_PAGE_SIZE).map((room) => (
                  <div key={room._id} className="card p-5 flex items-center gap-4 border-l-4 border-l-lime">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{room.name}</h3>
                      <p className="text-gray-400 text-sm">{room.capacity} places</p>
                    </div>
                    <span className="badge-green text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block"></span>
                      Disponible
                    </span>
                    <button
                      onClick={() => handleReserve(room._id)}
                      className="btn-lime px-5 py-2 text-sm"
                    >
                      Réserver
                    </button>
                  </div>
                ))}
                {Math.ceil(availableRooms.length / ROOM_PAGE_SIZE) > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() => setRoomPage(p => Math.max(1, p - 1))}
                      disabled={roomPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-navy-border text-gray-400 text-sm disabled:opacity-40 hover:text-white hover:border-gray-500 transition-colors"
                    >
                      ← Préc.
                    </button>
                    <span className="text-gray-400 text-sm">{roomPage} / {Math.ceil(availableRooms.length / ROOM_PAGE_SIZE)}</span>
                    <button
                      onClick={() => setRoomPage(p => Math.min(Math.ceil(availableRooms.length / ROOM_PAGE_SIZE), p + 1))}
                      disabled={roomPage === Math.ceil(availableRooms.length / ROOM_PAGE_SIZE)}
                      className="px-3 py-1.5 rounded-lg border border-navy-border text-gray-400 text-sm disabled:opacity-40 hover:text-white hover:border-gray-500 transition-colors"
                    >
                      Suiv. →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default CreateReservation;