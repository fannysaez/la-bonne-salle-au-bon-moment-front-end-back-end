import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

function LoginUser() {

    const context = useContext(UserContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login } = context;

async function onSubmit(data) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',   // ← pour que le cookie httpOnly soit envoyé/reçu
            body: JSON.stringify({ email: data.email, password: data.password }),
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.message || 'Identifiants incorrects');
            return;
        }

        const result = await response.json();
        // result = { user: { id, email, firstname, lastname, roleLabel } }

        login(result.user);
        navigate(`/dashboard/${result.user.roleLabel}`);

    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue');
    }
}
    return (
        <>
            <main className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">
                <h2 className="mt-14 text-center text-4xl font-extrabold uppercase text-white">
                    Page de connexion
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="mt-9 flex w-full max-w-[295px] flex flex-col">
                    <div>
                        <input type="email"
                            className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white"
                            placeholder="Identifiants ou adresse mail"
                            {...register("email",
                                { required: "L'email est obligatoire", })} />
                        {errors.email && (<p className="text-xs text-red-600 mb-5">{errors.email.message}</p>)}
                    </div>
                    <div>
                        <input type="password"
                            className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white"
                            placeholder="Mot de passe"
                            {...register("password",
                                { required: "Le mot de passe est obligatoire", })} />
                        {errors.password && (<p className="text-xs text-red-600 mb-5">{errors.password.message}</p>)}
                    </div>
                    <button type="submit"
                        className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                    > Se connecter </button>
                </form>
            </main >
        </>
    )
}
export default LoginUser
