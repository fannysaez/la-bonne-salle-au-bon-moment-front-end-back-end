import { HiUser, HiMail } from "react-icons/hi";

export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    roleId: string;
    roleLabel: string;
}

interface UserCardProps {
    user: User;
}

function UserCard({ user }: UserCardProps) {
    const roleColor: Record<string, string> = {
        Admin: "badge-green",
        Formateur: "badge-orange",
        Apprenant: "badge-gray",
    };

    return (
        <div className="card p-5 hover:border-lime/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center">
                    <HiUser className="text-lime text-xl" />
                </div>
                <div>
                    <p className="text-white font-semibold">{user.firstname} {user.lastname}</p>
                    <span className={roleColor[user.roleLabel] ?? "badge-gray"}>
                        {user.roleLabel}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <HiMail className="text-base shrink-0" />
                <span className="text-gray-300 truncate">{user.email}</span>
            </div>
        </div>
    );
}

export default UserCard;