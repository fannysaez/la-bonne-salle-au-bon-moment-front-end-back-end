import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function FormCompte() {

  const checkEmailAvailable = async (email: string): Promise<[]> => {
    const response = await fetch(`http://localhost:3000/api/users?email=${email}`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  };

  const compteSchema = z.object({
    lastname: z.string().min(2).max(100),
    firstname: z.string().min(2).max(100),
    email: z.string()
      .email("Veuillez entrer un email valide")
      .min(5, "Votre email doit contenir au moins 5 caractères")
      .refine(
        async (email) => {
          const available = await checkEmailAvailable(email);
          if (available.length == 0) return available;
        },
        { message: "Cet email est déjà utilisé" }
      ),
    password: z.string().min(6, "Votre mot de passe doit contenir au moins 6 caractères").max(100),
    roleId: z.string().refine((value) => value !== "", { message: "Please select an option" }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(compteSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data2 = await response.json();
      console.log(data2);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">
        <h2 className="text-center text-4xl font-bold uppercase text-black">Création de compte</h2>
        <div>
          <form className="flex flex-col items-center justify-center p-6 space-y-8 min-h-screen p-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-6">
                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Nom</label>
                <input type="text" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("lastname", { required: true })} />
              </div>
              {errors.lastname && <p>{errors.lastname.message}</p>}
            </div>

            <div>
              <div className="flex items-center gap-6">
                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Prénom</label>
                <input type="text" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("firstname")} />
              </div>
              {errors.firstname && <p>{errors.firstname.message}</p>}
            </div>

            <div>
              <div className="flex items-center gap-6">
                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Email</label>
                <input type="email" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("email")} />
              </div>
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center gap-6">
                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Mot de passe</label>
                <input type="password" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("password")} />
              </div>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div>
              <div className="flex items-center gap-6">
                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Rôle:</label>
                <select className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("roleId")}>
                  <option value="">Select...</option>
                  <option value="6a9a693e82b7be243c9ce3c4">Formateur</option>
                  <option value="6a9a693e82b7be243c9ce3c6">Administrateur</option>
                  <option value="6a9a693e82b7be243c9ce3c5">Apprenant</option>
                </select>
                {errors.roleId && <p>{errors.roleId.message}</p>}
              </div>
            </div>

            <button type="submit" className="w-44 text-white bg-black border-2 border-white rounded-xl p-2">Valider</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormCompte;