import { useState } from "react";
import { useNavigate } from "react-router";

function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!name || name.length < 5) {
      setError("Le nom doit comporter au moins 5 caractères");
      return;
    }
    if (!capacity || Number(capacity) <= 0) {
      setError("La capacité doit être supérieure à 0");
      return;
    }
    setError("");

    await fetch("http://localhost:3000/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, capacity: Number(capacity) }),
    });

    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-navy px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Créer une salle</h2>
        <p className="text-gray-400 mt-1">Définissez les caractéristiques de la nouvelle salle</p>
      </div>

      <div className="flex gap-6 items-start">

        {/* Formulaire */}
        <div className="card p-8 flex-1 border-t-4 border-t-lime">
          <p className="section-label mb-4">Informations</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Nom de la salle *</label>
              <input
                type="text"
                placeholder="ex. Salle Innovation"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">Capacité (personnes) *</label>
              <input
                type="number"
                placeholder="ex. 30"
                className="input-field"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2 mt-4">
              ⚠ {error}
            </p>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-lime/20 border border-lime/40 px-4 py-3 text-lime text-sm font-medium mt-4">
              ✓ Salle créée avec succès !
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate(-1)} className="btn-outline px-6">
              Annuler
            </button>
            <button onClick={handleSubmit} className="btn-lime flex items-center gap-2 px-6">
              ✓ Créer la salle
            </button>
          </div>
        </div>

        {/* Aperçu en temps réel */}
        <div className="card p-6 w-72 shrink-0 border-t-4 border-t-lime">
          <p className="section-label mb-4">Aperçu</p>
          <div className="bg-navy rounded-xl p-5 text-center">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="text-white font-semibold text-lg">
              {name || "Nom de la salle"}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              🔵 {capacity || "0"} places
            </p>
          </div>
          <div className="mt-4 bg-navy-card rounded-lg px-3 py-2 text-xs text-gray-400 flex items-start gap-2">
            <span>💡</span>
            L'aperçu se met à jour en temps réel pendant la saisie.
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateRoom;