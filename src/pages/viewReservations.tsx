import { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { ReservationContext } from "../context/ReservationContext";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import {
  HiChevronLeft,
  HiChevronRight,
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
} from "react-icons/hi";

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAYS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function ViewReservation() {
  const { reservationList, getReservationList } = useContext(ReservationContext);
  const { roomList, getRoomList } = useContext(RoomContext);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getReservationList();
    getRoomList();
  }, []);

  if (!context) return null;
  const { user, logout } = context;

  // Liens navbar
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

  // Calendrier
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDayMon = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getResForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return reservationList.filter((r) => r.startDate.startsWith(dateStr));
  };

  const getRoomName = (roomId: string) => {
    const room = roomList.find((r) => r._id === roomId);
    return room?.name ?? "Salle";
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours()}h`;
  };

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

      {/* Contenu */}
      <main className="max-w-screen-xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Planning des réservations</h1>
          <p className="text-gray-400 mt-1">Vue mensuelle de toutes les réservations</p>
        </div>

        {/* Calendrier */}
        <div className="card overflow-hidden">

          {/* Navigation mois */}
          <div className="flex items-center justify-center gap-8 py-4 bg-navy-nav border-b border-navy-border">
            <button
              onClick={prevMonth}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <HiChevronLeft className="text-2xl" />
            </button>
            <span className="text-white font-semibold text-lg min-w-[180px] text-center">
              {MONTHS_FR[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <HiChevronRight className="text-2xl" />
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 border-b border-navy-border">
            {DAYS_FR.map((day, i) => (
              <div
                key={day}
                className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                  i >= 5 ? "text-lime" : "text-gray-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grille jours */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const res = day ? getResForDay(day) : [];
              const today_ = day ? isToday(day) : false;
              const isWeekend = idx % 7 >= 5;

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 border-b border-r border-navy-border
                    ${!day ? "bg-navy-nav/20" : ""}
                    ${today_ ? "ring-2 ring-inset ring-lime/50 bg-lime/5" : ""}
                    ${isWeekend && day ? "bg-navy-nav/10" : ""}
                  `}
                >
                  {day && (
                    <>
                      <span
                        className={`inline-block text-sm font-medium mb-1 ${
                          today_ ? "text-lime font-bold" : "text-gray-300"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="space-y-1">
                        {res.map((r) => (
                          <div
                            key={r._id}
                            title={`${getRoomName(r.roomId)} ${formatTime(r.startDate)}-${formatTime(r.endDate)}`}
                            className="bg-lime text-navy text-xs font-semibold px-2 py-0.5 rounded truncate cursor-default"
                          >
                            {getRoomName(r.roomId)} {formatTime(r.startDate)}-{formatTime(r.endDate)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ViewReservation;