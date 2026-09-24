import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import { useNavigate, NavLink } from "react-router";
import {
  HiPlus,
  HiTrash,
  HiPencil,
  HiSearch,
  HiOfficeBuilding,
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
  HiUsers,
} from "react-icons/hi";

function RoomList() {
  const { getRoomList, roomList, deleteRoom } = useContext(RoomContext);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => { getRoomList(); }, []);

  if (!context) return null;
  const { user, logout } = context;

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

  const filtered = roomList.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy">

      {/* Navbar */}
      <nav className="bg-navy-nav border-b border-navy-border">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center h-[62px] gap-6">
          <span className="text-lime font-bold text-sm tracking-widest shrink-0">
            LA BONNE SALLE
          </span>
          <div className="flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-lime text-navy font-semibold text-sm"
                    : "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-navy-border text-sm transition-colors"
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <span className="badge-green text-xs flex items-center gap-1">
                {badge.icon} {badge.label}
              </span>
            )}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              <HiLogout /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label">Administration</p>
            <h2 className="text-3xl font-bold text-white">Gestion des salles</h2>
            <p className="text-gray-400 mt-1">
              {roomList.length} salle{roomList.length !== 1 ? "s" : ""} enregistrée{roomList.length !== 1 ? "s" : ""} dans le système
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => navigate("/userlist")}
              className="btn-outline flex items-center gap-2"
            >
              <HiUsers /> Gérer les comptes
            </button>
            <button
              onClick={() => navigate("/NewRoom")}
              className="btn-lime flex items-center gap-2"
            >
              <HiPlus /> Nouvelle salle
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <HiOfficeBuilding className="text-4xl text-gray-600 mb-3" />
            <p className="text-white font-semibold mb-1">Aucune salle trouvée</p>
            <p className="text-gray-400 text-sm">
              {search ? "Modifiez votre recherche ou " : ""}
              <button onClick={() => navigate("/NewRoom")} className="text-lime hover:underline">
                ajoutez une nouvelle salle
              </button>
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Salle</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Capacité</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border">
                {filtered.map((room) => (
                  <tr key={room._id} className="hover:bg-navy-border/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-lime/10 flex items-center justify-center shrink-0">
                          <HiOfficeBuilding className="text-lime text-lg" />
                        </div>
                        <span className="text-white font-medium">{room.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">
                        {room.capacity} personne{room.capacity !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/NewRoom?id=${room._id}`)}
                          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-navy-border text-gray-300 hover:text-white hover:border-lime/50 transition-colors cursor-pointer"
                        >
                          <HiPencil className="text-base" /> Éditer
                        </button>
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-red-800/60 text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors cursor-pointer"
                        >
                          <HiTrash className="text-base" /> Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-navy-border">
              <p className="text-gray-500 text-xs">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                {search && ` pour "${search}"`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomList;