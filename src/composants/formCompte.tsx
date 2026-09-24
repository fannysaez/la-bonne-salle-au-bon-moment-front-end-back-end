import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiAcademicCap,
  HiBookOpen,
  HiBriefcase,
  HiCog,
  HiChevronRight,
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

const STEPS = ["Identité", "Accès & Rôle", "Établissement"];

export default function FormCompte() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Apprenant" },
  });

  const selectedRole = watch("role");

  if (!context) return null;

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

  const nextStep = async () => {
    const fields: Record<number, (keyof FormData)[]> = {
      0: ["prenom", "nom", "email"],
      1: ["motDePasse", "confirmMotDePasse", "role"],
    };
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-navy">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="card p-10 flex flex-col items-center text-center max-w-md">
            <HiCheckCircle className="text-5xl text-lime mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Compte créé !
            </h2>
            <p className="text-gray-400 mb-6">
              Le nouveau compte utilisateur a bien été enregistré.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(0);
                }}
                className="btn-outline"
              >
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

  const sectionIdentite = (
    <div className="card p-6 space-y-5">
      <p className="section-label">Identité</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );

  const sectionAcces = (
    <div className="card p-6 space-y-5">
      <p className="section-label">Accès &amp; Rôle</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-red-400 text-xs mt-1">
              {errors.motDePasse.message}
            </p>
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
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmMotDePasse.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Rôle <span className="text-lime">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
  );

  const sectionEtab = (
    <div className="card p-6 space-y-5">
      <p className="section-label">Établissement</p>
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
  );

  return (
    <div className="min-h-screen bg-navy">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="section-label">Administration</p>
          <h1 className="text-3xl font-bold text-white">
            Créer un compte utilisateur
          </h1>
          <p className="text-gray-400 mt-1">
            Renseignez les informations du nouvel utilisateur
          </p>
        </div>
        {/* Stepper avec bouton Retour à gauche */}
        <div className="flex items-center justify-center mb-8 relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline flex items-center gap-2 absolute left-0"
          >
            <HiArrowLeft /> Retour
          </button>

          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 transition-colors ${
                    i < step
                      ? "bg-lime border-lime text-navy"
                      : i === step
                        ? "border-lime text-lime"
                        : "border-navy-border text-gray-500"
                  }`}
                >
                  {i < step ? <HiCheckCircle /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium text-center ${i === step ? "text-white" : "text-gray-500"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 h-0.5 mb-4 mx-2 ${i < step ? "bg-lime" : "bg-navy-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Contenu de l'étape */}
          <div className="mb-6">
            {step === 0 && sectionIdentite}
            {step === 1 && sectionAcces}
            {step === 2 && sectionEtab}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-outline flex items-center gap-2"
              >
                <HiArrowLeft /> Précédent
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-lime flex items-center gap-2"
              >
                Suivant <HiChevronRight />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-lime flex items-center gap-2"
              >
                <HiCheckCircle /> Créer le compte
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
