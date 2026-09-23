import { useContext } from "react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router";

import { UserContext } from "../context/UserContext";

function Dashboard() {
    const { role } = useParams();

    const context = useContext(UserContext);

    const {
        user,
        logout,
    } = context;

    // Vérification de sécurité :
    // le rôle de l'URL doit correspondre
    // au rôle de l'utilisateur.
    if (role !== user?.roleLabel) {
        return (
            <Navigate
                to={`/dashboard/${user?.roleLabel}`}
                replace
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#BCCCDB] flex flex-col items-center" >
            <h2 className="text-center text-4xl font-bold uppercase text-black mb-14">
                Espace {role}
            </h2>

            {role === "Admin" && (
                <div >

                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>  <Link to="/userlist">

                            <button type="submit"
                                className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                            > Liste des comptes </button>
                        </Link>
                        </div>

                        <div>
                            <Link to="/signin">
                                <button type="submit"
                                    className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                                > Créer un compte </button>
                            </Link>

                        </div>
                        <div>
                            <Link to="/roomlist">
                                <button type="submit"
                                    className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                                > Liste des salles </button>
                            </Link>
                        </div>


                        <div>
                            <Link to="/NewRoom">
                                <button type="submit"
                                    className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                                > Créer une salle </button>
                            </Link>
                        </div>

                        <Link to="/viewreservation"><button type="submit"
                                    className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                                > Mes réservations </button></Link>

                    </div>
                </div>
            )}

            {role === "Formateur" && (
                <div>
                    <h2>
                        Espace formateur
                    </h2>

                        <Link to="/viewreservation" >
                        <button className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white">Mes réservations</button>
                        </Link>
                
                </div>
            )}

            {role === "Apprenant" && (
                <div>
                    <h2>
                        Espace apprenant
                    </h2>

                    <p>
                        Mes formations,
                        mes réservations...
                    </p>
                </div>
            )}


            <button className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white"
                onClick={logout}>



                Se déconnecter
            </button>
        </div>
    );
}

export default Dashboard;