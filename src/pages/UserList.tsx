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
import Navbar from "../composants/NavBar";

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
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function countByRole(label: string) {
    if (label === "Tous") return userList.length;
    return userList.filter((u) => u.roleLabel === ROLE_LABEL_MAP[label]).length;
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <div className="px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="page-header">
          <div>
            <p className="section-label">Administration</p>
            <h2 className="text-3xl font-bold text-white">Gestion des comptes</h2>
            <p className="text-gray-400 mt-1">
              {userList.length} utilisateur{userList.length !== 1 ? "s" : ""} enregistré{userList.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => navigate("/signin")}
              className="btn-lime flex items-center gap-2 text-sm px-3 py-2"
            >
              <HiPlus /> Nouveau compte
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4 mb-5">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou rôle..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        {/* Filter — dropdown mobile / pills desktop */}
        <div className="filter-mobile mb-6">
          <select
            value={activeTab}
            onChange={(e) => { setActiveTab(e.target.value); setPage(1); }}
            className="input-field text-sm"
          >
            {ALL_ROLES.map((tab) => (
              <option key={tab} value={tab}>
                {tab} ({countByRole(tab)})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-desktop items-center gap-2 mb-6 flex-wrap">
          {ALL_ROLES.map((tab) => {
            const count = countByRole(tab);
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
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
          <>
            {/* Vue cartes — mobile */}
            <div className="user-cards-mobile">
              {paginated.map((u) => {
                const anyUser = u as never as {
                  _id: string; roleLabel: string; email?: string;
                  firstname?: string; lastname?: string; username?: string;
                };
                const initials = getInitials(anyUser);
                const fullName = getFullName(anyUser);
                const role = anyUser.roleLabel ?? "Apprenant";
                const avatarClass = AVATAR_COLORS[role] ?? "bg-gray-700 text-gray-300";
                const roleClass = ROLE_COLORS[role] ?? "bg-gray-700 text-gray-300";
                const roleIcon = ROLE_ICONS[role] ?? <HiUsers />;
                return (
                  <div key={anyUser._id} className="card p-4 flex items-center gap-3">
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " + avatarClass}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{fullName}</p>
                      <p className="text-gray-400 text-xs truncate">{anyUser.email ?? "—"}</p>
                      <span className={"inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 " + roleClass}>
                        {roleIcon} {role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled className="p-2 rounded-lg border border-navy-border text-gray-600 opacity-50 cursor-not-allowed">
                        <HiPencil />
                      </button>
                      <button disabled className="p-2 rounded-lg border border-navy-border text-gray-600 opacity-50 cursor-not-allowed">
                        <HiKey />
                      </button>
                      <button className="p-2 rounded-lg border border-red-800/60 text-red-400 hover:bg-red-900/20 transition-colors">
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
              <p className="text-gray-500 text-xs mt-3">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}{search && ` pour "${search}"`}</p>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-navy-border text-gray-400 text-sm disabled:opacity-40 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    ← Préc.
                  </button>
                  <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-navy-border text-gray-400 text-sm disabled:opacity-40 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    Suiv. →
                  </button>
                </div>
              )}
            </div>

            {/* Vue tableau — desktop */}
            <div className="user-table-desktop card overflow-hidden">
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
                {paginated.map((u) => {
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
          </>
        )}
      </div>
    </div>
  );
}

export default UserList;