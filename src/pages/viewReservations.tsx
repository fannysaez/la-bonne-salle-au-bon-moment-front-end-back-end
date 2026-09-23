import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import { UserContext } from "../context/UserContext";
import type { Reservation } from "../context/ReservationContext";
import ReservationCard from "../composants/ReservationCard";
import { Link } from "react-router";

function ViewReservation() {
  const { user, getUserList } = useContext(UserContext);
  useEffect(() => { getUserList(); }, []);

  const { getReservationList, reservationList } = useContext(ReservationContext);
  useEffect(() => { getReservationList(); }, []);

  const [userReservationList, setUserReservationList] = useState<Reservation[]>([]);
  useEffect(() => {
    if (!user) return;
    const filtered = reservationList.filter((res) => res.userId === user._id);
    setUserReservationList(filtered);
  }, [reservationList]);

  return (
    <>
      <Link to="/createreservation">
        <button className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white">
          Réserver une salle
        </button>
      </Link>
      {reservationList.map((reservation) => (
        <ReservationCard key={reservation._id} reservation={reservation} onChange={getReservationList} />
      ))}
    </>
  );
}

export default ViewReservation;