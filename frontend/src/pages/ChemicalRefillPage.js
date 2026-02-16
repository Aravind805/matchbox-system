import { useEffect, useState } from "react";

export default function ChemicalRefillPage() {
  const [barrels, setBarrels] = useState([]);
  const [barrelId, setBarrelId] = useState("");
  const [addedKg, setAddedKg] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/barrels`)
      .then(res => res.json())
      .then(setBarrels)
      .catch(console.error);
  }, []);

  const submitRefill = async () => {
    if (!barrelId || !addedKg || addedKg <= 0) {
      alert("Select barrel and enter valid amount");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/barrels/${barrelId}/refill`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ added_kg: Number(addedKg) })
        }
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Refill failed");
        return;
      }

      setMessage(`Refill successful. New stock: ${json.new_stock} kg`);
      setAddedKg("");
    } catch (err) {
      console.error(err);
      alert("Error during refill");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Chemical Refill</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Barrel</label>
        <select
          value={barrelId}
          onChange={e => setBarrelId(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Select barrel</option>
          {barrels.map(b => (
            <option key={b.id} value={b.id}>
              {b.barrel_code} (Stock: {b.current_stock_kg} kg)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Add Chemical (kg)</label>
        <input
          type="number"
          value={addedKg}
          onChange={e => setAddedKg(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button onClick={submitRefill} style={{ padding: "8px 16px" }}>
        Add Chemical
      </button>

      {message && (
        <p style={{ marginTop: 12, color: "green" }}>{message}</p>
      )}
    </div>
  );
}