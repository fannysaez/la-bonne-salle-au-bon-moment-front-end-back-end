import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router";
import {
  HiPlus,
  HiTrash,
  HiPencil,
  HiSearch,
  HiOfficeBuilding,
  HiCog,
  HiBookOpen,
  HiAcademicCap,
  HiUsers,
  HiUser,
} from "react-icons/hi";
import Navbar from "../composants/NavBar";

function RoomList() {
  const { getRoomList, roomList, deleteRoom } = useContext(RoomContext);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  useEffect(() => { getRoomList(); }, []);

  if (!context) return null;
  const { user } = context;

  const filtered = roomList.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <div className="px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="page-header">
          <div>
            <p className="section-label">Administration</p>
            <h2 className="text-3xl font-bold text-white">Gestion des salles</h2>
            <p className="text-gray-400 mt-1">
              {roomList.length} salle{roomList.length !== 1 ? "s" : ""} enregistrée{roomList.length !== 1 ? "s" : ""} dans le système
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => navigate("/userlist")}
              className="btn-outline flex items-center gap-2 text-sm px-3 py-2"
            >
              <HiUsers /> Gérer les comptes
            </button>
            <button
              onClick={() => navigate("/NewRoom")}
              className="btn-lime flex items-center gap-2 text-sm px-3 py-2"
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
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Salle</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Capacité</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border">
                {paginated.map((room) => (
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
                      <span className="flex items-center gap-1 text-gray-300 text-sm">
                        <HiUser className="text-gray-400" />{room.capacity}
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

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-navy-border flex flex-col items-center gap-2">
              <p className="text-gray-500 text-xs">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn-outline text-sm px-3 py-1.5 disabled:opacity-30"
                  >
                    ← Précédent
                  </button>
                  <span className="text-gray-400 text-sm">{page + 1} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="btn-outline text-sm px-3 py-1.5 disabled:opacity-30"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomList;