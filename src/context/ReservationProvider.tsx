import React, { useState, useContext } from "react";
import type { Reservation } from "./ReservationContext";
import { ReservationContext } from "./ReservationContext";
export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [reservationList, setReservationList] = useState<Reservation[]>([]);

  const getReservation = async (_id: string) => {
    const response = await fetch(`http://localhost:3000/api/reservations/${_id}`, {
      credentials: "include",
    });
    const data = await response.json();
    setReservation(data);
  };

  const postReservation = async (reservation: Reservation) => {
    await fetch("http://localhost:3000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reservation),
    });
  };

  const putReservation = async (_id: string, reservation: Reservation) => {
    await fetch(`http://localhost:3000/api/reservations/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reservation),
    });
  };

  const deleteReservation = async (_id: string) => {
    await fetch(`http://localhost:3000/api/reservations/${_id}`, {
      method: "DELETE",
      credentials: "include",
    });
  };

  const getReservationList = async () => {
    const response = await fetch("http://localhost:3000/api/reservations", {
      credentials: "include",
    });
    const data = await response.json();
    setReservationList(data);
  };

  return (
    <ReservationContext.Provider
      value={{
        _id: reservation?._id ?? "",
        userId: reservation?.userId ?? "",
        roomId: reservation?.roomId ?? "",
        startDate: reservation?.startDate ?? "",
        endDate: reservation?.endDate ?? "",
        getReservation,
        postReservation,
        putReservation,
        deleteReservation,
        getReservationList,
        reservationList,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservation must be used within a ReservationProvider");
  return context;
};