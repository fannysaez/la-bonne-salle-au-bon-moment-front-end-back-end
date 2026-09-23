import { createContext } from "react";

export type User = {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    roleId?: string,
    roleLabel: string,
};

type UserContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    userList: User[];
    getUserList: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);