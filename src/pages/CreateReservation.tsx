import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../context/ReservationContext";
import { UserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";
import { RoomContext } from "../context/RoomContext";
import type { User } from "../context/UserContext";
import { redirect } from "react-router";

function CreateReservation() {
  const { postReservation, getReservationList, reservationList } = useContext(ReservationContext);
  const { getRoomList, roomList } = useContext(RoomContext);
  useEffect(() => { getRoomList(); }, []);
  useEffect(() => { getReservationList(); }, []);
  const { user, userList, getUserList } = useContext(UserContext);
  useEffect(() => { getUserList(); }, []);

  const [success, setSuccess] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Reservation>();

  function onSubmit(data: Reservation) {
    let isOk = true;

    if (new Date(data.startDate).getTime() > new Date(data.endDate).getTime()) {
      setErrorForm("Date de fin inférieure à date de début");
      return;
    }

    for (let resa of reservationList) {
      if (data.roomId === resa.roomId) {
        if (
          !(
            new Date(data.endDate).getTime() <= new Date(resa.startDate).getTime() ||
            new Date(data.startDate).getTime() >= new Date(resa.endDate).getTime()
          )
        ) {
          isOk = false;
        }
      }
    }

    isOk ? postReservation(data) : setErrorForm("Salle indisponible sur ce créneau");
    isOk && setSuccess(true);
    throw redirect("/viewreservation");
  }

  return (
    <>
      <main className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">
        <h2 className="mt-14 text-center text-4xl font-extrabold uppercase text-white">Réserver un Créneau</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }}
          onClick={() => setErrorForm("")}
          className="mt-9 flex w-full max-w-[295px] flex flex-col"
        >
          <div>
            <label>Salle</label>
            <select defaultValue="" {...register("roomId", { required: "Salle Obligatoire" })}
              className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white">
              {roomList.map((room) => (
                <option key={room._id} value={room._id}>{room.name} / capacité : {room.capacity}</option>
              ))}
            </select>
            {errors.roomId && <p className="text-black-500 font-bold text-sm">{errors.roomId.message}</p>}
          </div>

          <div>
            <label>Utilisateur</label>
            {user != null && user.roleLabel === "Admin" && (
              <select defaultValue="" {...register("userId", { required: "Utilisateur Obligatoire" })}
                className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white">
                {userList.map((u: User) => (
                  <option key={u._id} value={u._id}>{u.firstname} {u.lastname}</option>
                ))}
              </select>
            )}
            {user != null && user.roleLabel !== "Admin" && (
              <select defaultValue="" {...register("userId", { required: "Utilisateur Obligatoire" })}
                className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white">
                <option value={user._id}>{user.firstname} {user.lastname}</option>
              </select>
            )}
            {errors.userId && <p className="text-black-500 font-bold text-sm">{errors.userId.message}</p>}
          </div>

          <div>
            <label>Date début</label>
            <input type="datetime-local" step="3600" {...register("startDate", { required: "Date début obligatoire" })}
              className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" />
            {errors.startDate && <p className="text-black-500 font-bold text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <label>Date fin</label>
            <input type="datetime-local" step="3600" {...register("endDate", { required: "Date fin obligatoire" })}
              className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" />
            {errors.endDate && <p className="text-black-500 font-bold text-sm">{errors.endDate.message}</p>}
          </div>

          <p className="text-black-500 font-bold text-sm">{errorForm}</p>
          <button type="submit" disabled={!isValid}
            className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed">
            Réserver un créneau
          </button>
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white shadow-lg">
              <span>✓ Créneau réservé avec succès !</span>
            </div>
          )}
        </form>
      </main>
    </>
  );
}

export default CreateReservation;