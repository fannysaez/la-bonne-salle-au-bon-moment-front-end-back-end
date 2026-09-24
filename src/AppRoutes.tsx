import { Route, Routes, Navigate } from "react-router";  // ← ajoute Navigate
import FormCompte from "./composants/formCompte";
import LoginUser from "./pages/LoginUser";
import ProtectedRoute from "./composants/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateReservation from "./pages/CreateReservation";
import UpdateReservation from "./pages/UpdateReservation";
import ViewReservation from "./pages/viewReservations";
import NewRoom from "./pages/NewRoom";
import UserList from "./pages/UserList";
import RoomList from "./pages/RoomList";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />  {/* ← AJOUTE */}
            <Route path="/login" element={<LoginUser />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/:role" element={<Dashboard />} />
                <Route path="/NewRoom" element={<NewRoom />} />
                <Route path="/signin" element={<FormCompte />} />
                <Route path="/createreservation" element={<CreateReservation />} />
                <Route path="/viewreservation" element={<ViewReservation />} />
                <Route path="/reservations/:id" element={<UpdateReservation />} />
                <Route path="/userlist" element={<UserList />} />
                <Route path="/roomlist" element={<RoomList />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;