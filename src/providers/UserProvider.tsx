import { useState } from "react";
import { UserContext, type User } from "../context/UserContext";

function UserProvider({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[]>([]);

    const login = (data: User) => {
        setUser(data);
    };

    const logout = () => {
        setUser(null);
    };

    async function getUserList() {
        try {
            const res = await fetch("http://localhost:3000/api/users", {
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error("Erreur lors de la récupération");
            }
            const data = await res.json();
            setUserList(data);
        } catch (error: any) {
            error && console.log("Une erreur est survenue" + error.message);
        }
    }

    return (
        <UserContext.Provider value={{ user, login, logout, getUserList, userList }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;