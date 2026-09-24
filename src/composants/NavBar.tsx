import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";
import {
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
} from "react-icons/hi";

export default function Navbar() {
  const context = useContext(UserContext);
  const navigate = useNavigate();

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

  return (
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
  );
}