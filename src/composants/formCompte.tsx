import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, NavLink } from "react-router";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiAcademicCap,
  HiBookOpen,
  HiBriefcase,
  HiCog,
  HiHome,
  HiCalendar,
  HiLogout,
} from "react-icons/hi";

const schema = z
  .object({
    prenom: z.string().min(1, "Le prénom est requis"),
    nom: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    motDePasse: z.string().min(6, "Minimum 6 caractères"),
    confirmMotDePasse: z.string().min(1, "Confirmation requise"),
    role: z.string().min(1, "Le rôle est requis"),
    departement: z.string().optional(),
    numeroEtudiant: z.string().optional(),
  })
  .refine((data) => data.motDePasse === data.confirmMotDePasse, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmMotDePasse"],
  });

type FormData = z.infer<typeof schema>;

const ROLES = [
  { value: "Apprenant", label: "Apprenant", icon: <HiAcademicCap /> },
  { value: "Formateur", label: "Formateur", icon: <HiBookOpen /> },
  { value: "Responsable", label: "Responsable", icon: <HiBriefcase /> },
  { value: "Admin", label: "Administrateur", icon: <HiCog /> },
];

export default function FormCompte() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Apprenant" },
  });

  const selectedRole = watch("role");

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

  const Navbar = () => (
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

  const onSubmit = async (data: FormData) => {
    await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstname: data.prenom,
        lastname: data.nom,
        email: data.email,
        password: data.motDePasse,
        roleLabel: data.role,
        departement: data.departement,
        numeroEtudiant: data.numeroEtudiant,
      }),
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-navy">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="card p-10 flex flex-col items-center text-center max-w-md">
            <HiCheckCircle className="text-5xl text-lime mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Compte créé !</h2>
            <p className="text-gray-400 mb-6">Le nouveau compte utilisateur a bien été enregistré.</p>
            <div className="flex gap-3">
              <button onClick={() => setSuccess(false)} className="btn-outline">
                Créer un autre compte
              </button>
              <button onClick={() => navigate(-1)} className="btn-lime">
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label">Administration</p>
            <h1 className="text-3xl font-bold text-white">Créer un compte utilisateur</h1>
            <p className="text-gray-400 mt-1">Renseignez les informations du nouvel utilisateur</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-2 mt-1">
            <HiArrowLeft /> Retour
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Section IDENTITÉ */}
          <div className="card p-6 space-y-5">
            <p className="section-label">Identité</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Prénom <span className="text-lime">*</span>
                </label>
                <input
                  {...register("prenom")}
                  className="input-field"
                  placeholder="ex. Marie"
                />
                {errors.prenom && (
                  <p className="text-red-400 text-xs mt-1">{errors.prenom.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Nom <span className="text-lime">*</span>
                </label>
                <input
                  {...register("nom")}
                  className="input-field"
                  placeholder="ex. Dupont"
                />
                {errors.nom && (
                  <p className="text-red-400 text-xs mt-1">{errors.nom.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Email professionnel <span className="text-lime">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="prenom.nom@etablissement.fr"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Section ACCÈS & RÔLE */}
          <div className="card p-6 space-y-5">
            <p className="section-label">Accès &amp; Rôle</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Mot de passe <span className="text-lime">*</span>
                </label>
                <input
                  {...register("motDePasse")}
                  type="password"
                  className="input-field"
                  placeholder="••••••••••"
                />
                {errors.motDePasse && (
                  <p className="text-red-400 text-xs mt-1">{errors.motDePasse.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Confirmer le mot de passe <span className="text-lime">*</span>
                </label>
                <input
                  {...register("confirmMotDePasse")}
                  type="password"
                  className="input-field"
                  placeholder="••••••••••"
                />
                {errors.confirmMotDePasse && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmMotDePasse.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Rôle <span className="text-lime">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setValue("role", r.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      selectedRole === r.value
                        ? "bg-lime text-navy border-lime"
                        : "border-navy-border text-gray-300 hover:border-lime/50 hover:text-white"
                    }`}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Section ÉTABLISSEMENT */}
          <div className="card p-6 space-y-5">
            <p className="section-label">Établissement</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Département / Formation
                </label>
                <input
                  {...register("departement")}
                  className="input-field"
                  placeholder="ex. Développement Web"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Numéro étudiant <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  {...register("numeroEtudiant")}
                  className="input-field"
                  placeholder="ex. 2023-WEB-042"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline px-8"
            >
              Annuler
            </button>
            <button type="submit" className="btn-lime flex items-center gap-2 px-8">
              <HiCheckCircle /> Créer le compte
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}