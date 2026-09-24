import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  HiUsers,
  HiSearch,
  HiPencil,
  HiTrash,
  HiKey,
  HiPlus,
  HiAcademicCap,
  HiBookOpen,
  HiBriefcase,
  HiCog,
  HiHome,
  HiCalendar,
  HiLogout,
} from "react-icons/hi";
import { useNavigate, NavLink } from "react-router";

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-red-900/40 text-red-300 border border-red-700/50",
  Formateur: "bg-amber-900/40 text-amber-300 border border-amber-700/50",
  Responsable: "bg-pink-900/40 text-pink-300 border border-pink-700/50",
  Apprenant: "bg-blue-900/40 text-blue-300 border border-blue-700/50",
};

const ROLE_ICONS: Record<string, JSX.Element> = {
  Admin: <HiCog />,
  Formateur: <HiBookOpen />,
  Responsable: <HiBriefcase />,
  Apprenant: <HiAcademicCap />,
};

const AVATAR_COLORS: Record<string, string> = {
  Admin: "bg-red-800 text-red-200",
  Formateur: "bg-amber-700 text-amber-100",
  Responsable: "bg-pink-800 text-pink-200",
  Apprenant: "bg-blue-800 text-blue-200",
};

function getInitials(user: { firstname?: string; lastname?: string; username?: string; email?: string }) {
  if (user.firstname && user.lastname) {
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  }
  if (user.username) return user.username.slice(0, 2).toUpperCase();
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "??";
}

function getFullName(user: { firstname?: string; lastname?: string; username?: string; email?: string }) {
  if (user.firstname || user.lastname) {
    return `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
  }
  return user.username ?? user.email ?? "—";
}

const ALL_ROLES = ["Tous", "Apprenants", "Formateurs", "Admins"];
const ROLE_LABEL_MAP: Record<string, string> = {
  Apprenants: "Apprenant",
  Formateurs: "Formateur",
  Admins: "Admin",
  Responsables: "Responsable",
};

function UserList() {
  const { getUserList, userList } = useContext(UserContext);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tous");

  useEffect(() => {
    getUserList();
  }, []);

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

  const filtered = userList.filter((u) => {
    const name = getFullName(u as never).toLowerCase();
    const email = ((u as never as { email?: string }).email ?? "").toLowerCase();
    const role = (u.roleLabel ?? "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      !search || name.includes(query) || email.includes(query) || role.includes(query);

    const matchesTab =
      activeTab === "Tous" ||
      u.roleLabel === ROLE_LABEL_MAP[activeTab];

    return matchesSearch && matchesTab;
  });

  function countByRole(label: string) {
    if (label === "Tous") return userList.length;
    return userList.filter((u) => u.roleLabel === ROLE_LABEL_MAP[label]).length;
  }

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
            <h2 className="text-3xl font-bold text-white">Gestion des comptes</h2>
            <p className="text-gray-400 mt-1">
              {userList.length} utilisateur{userList.length !== 1 ? "s" : ""} enregistré{userList.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/signin")}
            className="btn-lime flex items-center gap-2 mt-1"
          >
            <HiPlus /> Nouveau compte
          </button>
        </div>

        {/* Search */}
        <div className="card p-4 mb-5">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou rôle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {ALL_ROLES.map((tab) => {
            const count = countByRole(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-lime text-navy"
                    : "bg-navy-border/50 text-gray-400 hover:text-white hover:bg-navy-border"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <HiUsers className="text-5xl text-gray-600 mb-4" />
            <p className="text-white font-semibold mb-1">Aucun utilisateur trouvé</p>
            {search && (
              <p className="text-gray-400 text-sm">Essayez avec un autre terme de recherche</p>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Utilisateur
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Rôle
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border">
                {filtered.map((u) => {
                  const anyUser = u as never as {
                    _id: string;
                    roleLabel: string;
                    email?: string;
                    firstname?: string;
                    lastname?: string;
                    username?: string;
                  };
                  const initials = getInitials(anyUser);
                  const fullName = getFullName(anyUser);
                  const role = anyUser.roleLabel ?? "Apprenant";
                  const avatarClass = AVATAR_COLORS[role] ?? "bg-gray-700 text-gray-300";
                  const roleClass = ROLE_COLORS[role] ?? "bg-gray-700 text-gray-300";
                  const roleIcon = ROLE_ICONS[role] ?? <HiUsers />;

                  return (
                    <tr
                      key={anyUser._id}
                      className="hover:bg-navy-border/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarClass}`}
                          >
                            {initials}
                          </div>
                          <span className="text-white font-medium">{fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{anyUser.email ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${roleClass}`}>
                          {roleIcon} {role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            disabled
                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-navy-border text-gray-600 opacity-50 cursor-not-allowed"
                          >
                            <HiPencil className="text-base" /> Edit
                          </button>
                          <button
                            disabled
                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-navy-border text-gray-600 opacity-50 cursor-not-allowed"
                          >
                            <HiKey className="text-base" /> Reset
                          </button>
                          <button
                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-red-800/60 text-red-400 hover:bg-red-900/20 hover:border-red-600 transition-colors cursor-pointer"
                          >
                            <HiTrash className="text-base" /> Sup
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

export default UserList;