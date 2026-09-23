import { useState } from "react";

function CreateRoom() {
  const [form, setForm] = useState<{ name?: string; capacity?: number }>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (form?.name === undefined || form.name.length < 5) {
      setError("Le nom de la salle est obligatoire et doit comporter au moins 5 caractères");
      return;
    }

    if (form?.capacity === undefined || form.capacity == 0) {
      setError("La capacité de la salle doit être supérieure à 0");
      return;
    }

    setError("");

    await fetch("http://localhost:3000/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    setSuccess(true);
  }

  return (
    <>
      <label>nom de la salle (5 caractères minimum)</label>
      <input type="text" name="name" value={form?.name ?? ""} onChange={handleChange} />

      <label>capacité de la salle (nombre de personnes)</label>
      <input type="number" name="capacity" value={form?.capacity ?? ""} onChange={handleChange} />

      {error && <p>{error}</p>}
      {success && <p>Salle créée avec succès !</p>}

      <button type="submit" onClick={handleSubmit}>Ajouter</button>
    </>
  );
}

export default CreateRoom;