import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router";
import { UserContext } from "../context/UserContext";
import {
  HiArrowLeft,
  HiHome,
  HiCalendar,
  HiBookOpen,
  HiCog,
  HiLogout,
  HiAcademicCap,
} from "react-icons/hi";
import Navbar from "../composants/NavBar";

type RoomFormData = {
  name: string;
  capacity: number;
};

function NewRoom() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RoomFormData>({ mode: "onChange" });
  const [success, setSuccess] = useState(false);

  if (!context) return null;
  const { user, logout } = context;

  const navLinks = [
    { to: `/dashboard/${user?.roleLabel}`, label: "Accueil", icon: <HiHome /> },
    { to: "/viewreservation", label: "Planning", icon: <HiCalendar /> },
    { to: "/createreservation", label: "Mes réservations", icon: <HiBookOpen /> },
    ...(user?.roleLabel === "Admin"
      ? [{ to: "/dashboard/Admin", label: "Espace Admin", icon: <HiCog /> }]
      : []),
  ];

  const roleBadge = () => {
    if (user?.roleLabel === "Admin") return { icon: <HiCog />, label: "Admin" };
    if (user?.roleLabel === "Formateur") return { icon: <HiBookOpen />, label: "Formateur" };
    return { icon: <HiAcademicCap />, label: "Apprenant" };
  };
  const badge = roleBadge();

  async function onSubmit(data: RoomFormData) {
    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log(result);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 10000);
    } catch (error) {
      console.error("Erreur dans la création de salle:", error);
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Contenu centré */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="card w-full max-w-lg p-8 border-t-4 border-t-lime">

          <div className="mb-8 page-header-text">
            <p className="section-label">Administration</p>
            <h2 className="text-2xl font-bold text-white">Création de salle</h2>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Nom de la salle
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Salle Horizon"
                {...register("name", {
                  required: "Le nom de la salle est obligatoire",
                  minLength: { value: 5, message: "Minimum 5 caractères" },
                })}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Capacité</label>
              <input
                type="number"
                className="input-field"
                placeholder="20"
                {...register("capacity", {
                  required: "La capacité est obligatoire",
                })}
              />
              {errors.capacity && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline flex items-center justify-center gap-2 flex-1"
              >
                <HiArrowLeft /> Retour
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="btn-lime flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Créer la salle
              </button>
            </div>

            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-lime/20 border border-lime/40 px-4 py-3 text-lime text-sm font-medium">
                ✓ Salle créée avec succès !
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewRoom;