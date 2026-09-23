export interface User {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    roleId: string,
    roleLabel: string;
}

interface UserCardProps {
    user: User;
}

function UserCard({ user }: UserCardProps) {
    return (
        <>
            <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Prénom : <span className="font-medium text-gray-900">{user.firstname}</span></p>
                <p className="text-sm text-gray-500">Nom : <span className="font-medium text-gray-900">{user.lastname}</span></p>
                <p className="text-sm text-gray-500">Email : <span className="font-medium text-gray-900">{user.email}</span></p>
            </div>
        </>
    );
}

export default UserCard;