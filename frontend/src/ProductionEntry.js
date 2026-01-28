import React, { useEffect, useRef, useState } from "react";

function ProductionEntry() {
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

    if (!barrelId || !brandId || !chemicalUsedKg || !sheetsProduced) {
      setMessage("❌ Please fill all fields correctly");
      return;
    }

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

    setMessage(`✅ Saved | Efficiency: ${data.efficiency}%`);

    setBarrelId("");
    setBrandInput("");
    setBrandId(null);
    setChemicalUsedKg("");
    setSheetsProduced("");
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Production Entry</h2>

        {/* Barrel */}
        <select
          value={barrelId}
          onChange={(e) => setBarrelId(e.target.value)}
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
        <div ref={brandBoxRef} style={{ position: "relative" }}>
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

        <button style={styles.submitButton}>Submit</button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

/* ---------------------------
   Styles
---------------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif"
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    width: 380,
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
  },
  title: {
    textAlign: "center",
    marginBottom: 16
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #cbd5e1"
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
    fontSize: 16
  },
  message: {
    marginTop: 12,
    textAlign: "center"
  }
};

export default ProductionEntry;
