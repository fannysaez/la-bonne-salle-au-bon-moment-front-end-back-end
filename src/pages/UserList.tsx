import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import UserCard from "../composants/UserCard";

function UserList() {
    const { getUserList, userList } = useContext(UserContext);
    useEffect(() => { getUserList() }, [])

    return (
        <>
            <div className="grid grid-cols-4 mt-10 p-5">
                {userList.map((user) => (
                    <UserCard key={user._id} user={user} />
                ))}
            </div>
        </>
    )
}

export default UserList