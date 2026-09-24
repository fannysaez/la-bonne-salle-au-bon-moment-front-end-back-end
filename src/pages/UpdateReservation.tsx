import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { ChangeEvent } from "react";
import { UserContext } from "../context/UserContext";
import { ReservationContext } from "../context/ReservationContext";
import { RoomContext } from "../context/RoomContext";
import type { Reservation } from "../context/ReservationContext";

function UpdateReservation() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { getReservationList } = useContext(ReservationContext);
  const { getRoomList, roomList } = useContext(RoomContext);
  useEffect(() => { getRoomList(); }, []);
  useEffect(() => { getReservationList(); }, []);

  const { id } = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setReservation(data);
    };
    fetchReservation();
  }, [id]);

  const [form, setForm] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (reservation) {
      setForm({
        roomId: reservation.roomId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
      });
    }
  }, [reservation]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function putReservation(_id: string, donnees: Partial<Reservation>) {
    const response = await fetch(`http://localhost:3000/api/reservations/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(donnees),
    });
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return response.json();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reservation) return;

    if (reservation.userId !== user?._id && user?.roleId !== "1") {
      navigate(`/dashboard/${user?.roleLabel}`);
      return;
    }

    const confirmed = window.confirm("Voulez-vous vraiment modifier cette réservation ?");
    if (!confirmed) return;

    const newReservation = {
      roomId: form.roomId,
      startDate: form.startDate,
      endDate: form.endDate,
      userId: reservation.userId,
    };

    if (typeof id === "string") {
      await putReservation(id, newReservation);
      window.alert("Modifications effectuées avec succès.");
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="card w-full max-w-lg p-8 border-t-4 border-t-lime">

        <div className="mb-8">
          <p className="section-label">Planning</p>
          <h2 className="text-2xl font-bold text-white">Modifier la réservation</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="block text-gray-400 text-sm mb-1">Salle</label>
            <select
              name="roomId"
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
              required
              className="input-field"
            >
              {roomList.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} — capacité : {room.capacity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Date de début</label>
            <input
              type="datetime-local"
              step="3600"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Date de fin</label>
            <input
              type="datetime-local"
              step="3600"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn-lime flex-1">
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline flex-1"
            >
              Annuler
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UpdateReservation;