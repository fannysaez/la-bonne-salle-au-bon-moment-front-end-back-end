import { createContext } from "react";

export type Reservation = {
    _id: string,
    userId: string,
    roomId: string,
    startDate: string,
    endDate: string,
}

export interface ReservationContextType extends Reservation {
    getReservation: (_id: string) => void;
    postReservation: (reservation: Reservation) => void;
    putReservation: (_id: string, reservation: Reservation) => void;
    deleteReservation: (_id: string) => void;
    getReservationList: () => void;
    reservationList: Reservation[];
}

export const ReservationContext = createContext<ReservationContextType>(
    {} as ReservationContextType
);