import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

function LoginUser() {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { login } = context;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Identifiants incorrects");
        return;
      }
      const result = await response.json();
      login(result.user);
      navigate(`/dashboard/${result.user.roleLabel}`);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    }
  }

  return (
    <div className="min-h-screen bg-navy flex">

      {/* COLONNE GAUCHE */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative">
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-lime" />
        <h1 className="text-6xl font-black text-lime tracking-tight leading-none mb-3">
          LA BONNE SALLE
        </h1>
        <h2 className="text-2xl font-bold text-white tracking-widest mb-6">
          AU BON MOMENT
        </h2>
        <div className="w-80 h-[2px] bg-navy-border mb-6" />
        <p className="text-gray-400 mb-8">Application de réservation de salles</p>
        <div className="flex flex-wrap gap-3">
          {["Node.js", "Express", "TypeScript", "MongoDB", "React"].map((tech) => (
            <span key={tech} className="border border-navy-border text-gray-300 text-xs px-3 py-1.5 rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <p className="absolute bottom-6 text-gray-600 text-xs">
          Fanny Saez · La Bonne Salle au Bon Moment
        </p>
      </div>

      {/* COLONNE DROITE */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6">
        <div className="card w-full max-w-md p-10">
          <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
          <p className="text-gray-400 text-sm mb-8">
            Accédez à votre espace de réservation
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Adresse email</label>
              <input
                type="email"
                className="input-field"
                placeholder="votre@email.com"
                {...register("email", { required: "L'email est obligatoire" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Mot de passe</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••••"
                {...register("password", { required: "Le mot de passe est obligatoire" })}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="btn-lime w-full mt-2 tracking-widest">
              SE CONNECTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;