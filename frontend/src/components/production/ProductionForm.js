import React, { useEffect, useRef, useState } from "react";

export default function ProductionForm({
  onBarrelChange,
  onEfficiency,
  onProductionResult
}) {
  const [barrels, setBarrels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const [barrelId, setBarrelId] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [brandId, setBrandId] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const [chemicalUsedKg, setChemicalUsedKg] = useState("");
  const [sheetsProduced, setSheetsProduced] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const brandBoxRef = useRef(null);

  /* ---------------------------
     Fetch barrels & brands
  ---------------------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/barrels")
      .then(res => res.json())
      .then(setBarrels);

    fetch("http://localhost:5000/api/brands")
      .then(res => res.json())
      .then(setBrands);
  }, []);

  /* ---------------------------
     Brand autocomplete filter
  ---------------------------- */
  useEffect(() => {
    const filtered = brands.filter(b =>
      b.name.toLowerCase().includes(brandInput.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [brandInput, brands]);

  /* ---------------------------
     Close dropdown on outside click
  ---------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (brandBoxRef.current && !brandBoxRef.current.contains(e.target)) {
        setShowBrandDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------------
     Submit production entry
  ---------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");


    if (!barrelId || !brandId || !chemicalUsedKg || !sheetsProduced) {
      setMessage("❌ Please fill all fields correctly");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/api/production-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barrel_id: Number(barrelId),
          brand_id: Number(brandId),
          chemical_used_kg: Number(chemicalUsedKg),
          sheets_produced: Number(sheetsProduced)
        })
      });

      const data = await res.json();

      if (!res.ok) {
  setMessage("❌ " + data.error);
  return;
}

setMessage(`✅ Saved successfully • Efficiency: ${data.efficiency}%`);
onEfficiency?.(data.efficiency);

onProductionResult?.({
  actualSheets: Number(data.sheets_produced ?? sheetsProduced),
  chemicalUsedKg: Number(data.chemical_used_kg ?? chemicalUsedKg)
});


      // Reset form
      setBarrelId("");
      setBrandInput("");
      setBrandId(null);
      setChemicalUsedKg("");
      setSheetsProduced("");

    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    barrelId && brandId && chemicalUsedKg && sheetsProduced;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Production Entry</h2>

      <form onSubmit={handleSubmit}>
        {/* Barrel */}
        <select
          value={barrelId}
          onChange={(e) => {
  const value = e.target.value;
  setBarrelId(value);

  const barrel = barrels.find(b => b.id === Number(value));
  onBarrelChange?.(barrel);
}}

          style={styles.input}
        >
          <option value="">Select Barrel</option>
          {barrels.map(b => (
            <option key={b.id} value={b.id}>
              {b.barrel_code} — {b.chemical.code} ({b.current_stock_kg} kg)
            </option>
          ))}
        </select>

        {/* Brand autocomplete */}
        <div
  ref={brandBoxRef}
  style={{
    position: "relative",
    zIndex: 5
  }}
>
          <input
            type="text"
            placeholder="Select brand"
            value={brandInput}
            onFocus={() => setShowBrandDropdown(true)}
            onChange={(e) => {
              setBrandInput(e.target.value);
              setBrandId(null);
            }}
            style={styles.input}
          />

          {showBrandDropdown && (
            <div style={styles.dropdown}>
              {filteredBrands.length === 0 && (
                <div style={styles.noItem}>No brands found</div>
              )}
              {filteredBrands.map(b => (
                <div
                  key={b.id}
                  style={styles.item}
                  onClick={() => {
                    setBrandInput(b.name);
                    setBrandId(b.id);
                    setShowBrandDropdown(false);
                  }}
                >
                  {b.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="number"
          step="0.01"
          placeholder="Chemical used (kg)"
          value={chemicalUsedKg}
          onChange={(e) => setChemicalUsedKg(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Sheets produced"
          value={sheetsProduced}
          onChange={(e) => setSheetsProduced(e.target.value)}
          style={styles.input}
        />

        <button
          type="submit"
          style={{
            ...styles.submitButton,
            opacity: isFormValid && !submitting ? 1 : 0.6
          }}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Saving..." : "Submit"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

/* ---------------------------
   Styles (component-level only)
---------------------------- */
const styles = {
  card: {
  background: "#ffffff",
  padding: 16,
  borderRadius: 10,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  maxWidth: 360,
  zIndex: 1
},
  title: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 600
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14
  },
  dropdown: {
  position: "absolute",
  width: "100%",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  maxHeight: 160,
  overflowY: "auto",
  zIndex: 20
},
  item: {
    padding: 8,
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb"
  },
  noItem: {
    padding: 8,
    textAlign: "center",
    color: "#64748b"
  },
  submitButton: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer"
  },
  message: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14
  }
};
