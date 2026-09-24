import { useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import { ReservationContext } from "../context/ReservationContext";
import {
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiOfficeBuilding,
  HiUsers,
  HiAcademicCap,
  HiChartBar,
  HiUserAdd,
  HiClipboardList,
  HiDocumentReport,
} from "react-icons/hi";

const RECENT_ACTIVITY = [
  { text: "Marie L. a réservé Salle Innovation – 24 Sept 09h00", time: "Il y a 5 min" },
  { text: "Thomas B. a annulé sa réservation – Amphi Lumière", time: "Il y a 23 min" },
  { text: "Nouveau compte créé : julie.martin@edu.fr", time: "Il y a 1h" },
  { text: "Salle Créativité – maintenance planifiée ajoutée", time: "Il y a 2h" },
  { text: "Pierre D. a réservé Labo Numérique – 25 Sept", time: "Il y a 3h" },
  { text: "Rapport mensuel généré – Septembre 2026", time: "Il y a 4h" },
];

export default function Dashboard() {
  const context = useContext(UserContext);
  const roomCtx = useContext(RoomContext);
  const resaCtx = useContext(ReservationContext);

  if (!context) return null;
  const { user, logout } = context;
  const navigate = useNavigate();

  useEffect(() => {
    roomCtx.getRoomList();
    resaCtx.getReservationList();
    context.getUserList();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const reservationsToday = resaCtx.reservationList.filter((r) =>
    r.startDate.startsWith(today)
  ).length;

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

      <main className="max-w-screen-xl mx-auto px-6 py-10">

        {/* ── ADMIN DASHBOARD ── */}
        {user?.roleLabel === "Admin" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Espace Administration</h1>
              <p className="text-gray-400 mt-1">Vue d'ensemble du système</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="card p-5 border-t-2 border-t-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <HiOfficeBuilding className="text-blue-400 text-2xl" />
                  <span className="text-3xl font-bold text-white">{roomCtx.roomList.length}</span>
                </div>
                <p className="text-gray-400 text-sm">Salles actives</p>
              </div>
              <div className="card p-5 border-t-2 border-t-orange-400">
                <div className="flex items-center gap-3 mb-2">
                  <HiCalendar className="text-orange-400 text-2xl" />
                  <span className="text-3xl font-bold text-white">{reservationsToday}</span>
                </div>
                <p className="text-gray-400 text-sm">Réservations auj.</p>
              </div>
              <div className="card p-5 border-t-2 border-t-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <HiUsers className="text-yellow-400 text-2xl" />
                  <span className="text-3xl font-bold text-white">{context.userList.length}</span>
                </div>
                <p className="text-gray-400 text-sm">Utilisateurs</p>
              </div>
              <div className="card p-5 border-t-2 border-t-purple-400">
                <div className="flex items-center gap-3 mb-2">
                  <HiChartBar className="text-purple-400 text-2xl" />
                  <span className="text-3xl font-bold text-white">
                    {roomCtx.roomList.length > 0
                      ? Math.round((reservationsToday / roomCtx.roomList.length) * 100)
                      : 0}%
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Taux occupation</p>
              </div>
            </div>

            {/* Actions rapides */}
            <p className="section-label mb-3">Actions rapides</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => navigate("/NewRoom")}
                className="card p-4 flex items-center gap-3 text-left hover:border-lime transition-colors group"
              >
                <HiOfficeBuilding className="text-lime text-xl shrink-0" />
                <span className="text-white text-sm font-medium">Créer une salle</span>
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="card p-4 flex items-center gap-3 text-left hover:border-blue-400 transition-colors group"
              >
                <HiUserAdd className="text-blue-400 text-xl shrink-0" />
                <span className="text-white text-sm font-medium">Créer un compte</span>
              </button>
              <button
                onClick={() => navigate("/viewreservation")}
                className="card p-4 flex items-center gap-3 text-left hover:border-orange-400 transition-colors group"
              >
                <HiClipboardList className="text-orange-400 text-xl shrink-0" />
                <span className="text-white text-sm font-medium">Voir les demandes</span>
              </button>
              <button
                disabled
                className="card p-4 flex items-center gap-3 text-left opacity-40 cursor-not-allowed"
              >
                <HiDocumentReport className="text-purple-400 text-xl shrink-0" />
                <span className="text-white text-sm font-medium">Exporter rapport</span>
              </button>
            </div>

            {/* Activité récente */}
            <p className="section-label mb-3">Activité récente</p>
            <div className="card divide-y divide-navy-border">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-lime shrink-0" />
                  <div>
                    <p className="text-white text-sm">{item.text}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── USER DASHBOARD ── */}
        {user?.roleLabel !== "Admin" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">
                Bienvenue, {user?.firstname}
              </h1>
              <p className="text-gray-400">Réservez une salle disponible pour votre session</p>
            </div>

            <p className="section-label">Salles disponibles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <button
                onClick={() => navigate("/createreservation")}
                className="card p-6 text-left hover:border-lime transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-lime/20 flex items-center justify-center mb-4 group-hover:bg-lime/30 transition-colors">
                  <HiCalendar className="text-lime text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-1">Réserver une salle</h3>
                <p className="text-gray-400 text-sm">Choisir un créneau disponible</p>
              </button>
              <button
                onClick={() => navigate("/viewreservation")}
                className="card p-6 text-left hover:border-lime transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-lime/20 flex items-center justify-center mb-4 group-hover:bg-lime/30 transition-colors">
                  <HiBookOpen className="text-lime text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-1">Mes réservations</h3>
                <p className="text-gray-400 text-sm">Voir et gérer mes créneaux</p>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}