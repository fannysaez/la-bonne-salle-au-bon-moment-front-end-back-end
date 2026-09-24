import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";
import {
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
  HiMenu,
  HiX,
} from "react-icons/hi";

export default function Navbar() {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!context) return null;
  const { user, logout } = context;

  const navLinks = [
    { to: `/dashboard/${user?.roleLabel}`, label: "Accueil", icon: <HiHome /> },
    { to: "/viewreservation", label: "Planning", icon: <HiCalendar /> },
    {
      to: "/createreservation",
      label: "Mes réservations",
      icon: <HiBookOpen />,
    },
    ...(user?.roleLabel === "Admin"
      ? [{ to: "/roomlist", label: "Espace Admin", icon: <HiCog /> }]
      : []),
  ];

  const roleBadge = () => {
    if (user?.roleLabel === "Admin") return { icon: <HiCog />, label: "Admin" };
    if (user?.roleLabel === "Formateur")
      return { icon: <HiBookOpen />, label: "Formateur" };
    return { icon: <HiAcademicCap />, label: "Apprenant" };
  };
  const badge = roleBadge();

  return (
    <>
      <nav className="bg-navy-nav border-b border-navy-border">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center h-[62px] gap-6">
          <span className="text-lime font-bold text-sm tracking-widest shrink-0">
            LA BONNE SALLE
          </span>

          {/* Desktop links */}
          <div className="nav-desktop items-center gap-1 flex-1">
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

          {/* Desktop right */}
          <div className="nav-desktop items-center gap-3 shrink-0">
            {user && (
              <span className="badge-green text-xs flex items-center gap-1">
                {badge.icon} {badge.label}
              </span>
            )}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              <HiLogout /> Déconnexion
            </button>
          </div>

          {/* Burger button */}
          <button
            onClick={() => setIsOpen(true)}
            className="nav-mobile-btn ml-auto items-center bg-transparent border-0 text-gray-300 hover:text-white text-2xl transition-colors cursor-pointer p-2"
            aria-label="Ouvrir le menu"
          >
            <HiMenu />
          </button>
        </div>
      </nav>

      {/* Overlay sombre */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar droite */}
      <div
        className="fixed top-0 right-0 h-full w-72 bg-navy-nav z-50 flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* En-tête sidebar */}
        <div className="flex items-center justify-between px-6 h-[62px] border-b-2 border-lime shrink-0">
          <span className="text-lime font-bold text-sm tracking-widest">
            LA BONNE SALLE
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white text-2xl transition-colors cursor-pointer bg-transparent border-0 p-1"
            aria-label="Fermer le menu"
          >
            <HiX />
          </button>
        </div>

        {/* Liens de navigation */}
        <div className="flex flex-col flex-1 px-4 py-6 overflow-y-auto">
          {navLinks.map((link, index) => (
            <div key={link.to}>
              <NavLink
                to={link.to}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-5 py-4 rounded-lg bg-lime text-navy font-semibold text-sm"
                    : "flex items-center gap-3 px-5 py-4 rounded-lg text-gray-300 hover:text-white hover:bg-navy-border text-sm transition-colors"
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
              {index < navLinks.length - 1 && (
                <div className="h-px mx-4 my-2" style={{ backgroundColor: "rgba(163, 230, 53, 0.3)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Bas de sidebar — badge + déconnexion */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ borderTop: "2px solid rgba(163, 230, 53, 0.5)" }}
        >
          {user && (
            <span className="badge-green text-xs flex items-center gap-1">
              {badge.icon} {badge.label}
            </span>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
          >
            <HiLogout /> Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}
