import { useEffect, useState } from "react";

export default function BrandManagementPage() {
  const [brands, setBrands] = useState([]);

  // add brand
  const [newName, setNewName] = useState("");
  const [newExpected, setNewExpected] = useState("");

  // search & manage
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [expected, setExpected] = useState("");
  const [message, setMessage] = useState("");

  /* ---------------------------
     Load brands
  ---------------------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(console.error);
  }, []);

  /* ---------------------------
     Add brand
  ---------------------------- */
  const addBrand = async () => {
    if (!newName || !newExpected || newExpected <= 0) {
      alert("Enter valid brand details");
      return;
    }

    const res = await fetch("http://localhost:5000/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        expected_sheets_per_kg: Number(newExpected)
      })
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Failed to add brand");
      return;
    }

    setBrands(prev => [...prev, json.brand]);
    setNewName("");
    setNewExpected("");
    setMessage("Brand added successfully");
  };

  /* ---------------------------
     Search
  ---------------------------- */
  const suggestions = query
    ? brands.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    setExpected(brand.expected_sheets_per_kg);
    setQuery(brand.name);
    setMessage("");
  };

  /* ---------------------------
     Update expected sheets
  ---------------------------- */
  const updateExpected = async () => {
    const res = await fetch(
      `http://localhost:5000/api/brands/${selectedBrand.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expected_sheets_per_kg: Number(expected)
        })
      }
    );

    if (!res.ok) {
      alert("Failed to update brand");
      return;
    }

    setBrands(prev =>
      prev.map(b =>
        b.id === selectedBrand.id
          ? { ...b, expected_sheets_per_kg: Number(expected) }
          : b
      )
    );

    setMessage("Expected sheets updated");
  };

  /* ---------------------------
     Delete brand
  ---------------------------- */
  const deleteBrand = async () => {
    const ok = window.confirm(
      "Delete this brand permanently?\nThis cannot be undone."
    );
    if (!ok) return;

    const res = await fetch(
      `http://localhost:5000/api/brands/${selectedBrand.id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      alert("Failed to delete brand");
      return;
    }

    setBrands(prev =>
      prev.filter(b => b.id !== selectedBrand.id)
    );

    setSelectedBrand(null);
    setQuery("");
    setExpected("");
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2>Brand Management</h2>

      {/* ADD BRAND */}
      <div style={styles.card}>
        <h4>Add New Brand</h4>
        <input
          placeholder="Brand name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Expected sheets / kg"
          value={newExpected}
          onChange={e => setNewExpected(e.target.value)}
          style={styles.input}
        />
        <button onClick={addBrand}>Add Brand</button>
      </div>

      {/* SEARCH */}
      <div style={styles.card}>
        <h4>Search Brand</h4>
        <input
          placeholder="Type brand name..."
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSelectedBrand(null);
          }}
          style={styles.input}
        />

        {query && !selectedBrand && suggestions.length > 0 && (
          <div style={styles.suggestions}>
            {suggestions.slice(0, 8).map(b => (
              <div
                key={b.id}
                style={styles.suggestion}
                onClick={() => selectBrand(b)}
              >
                {b.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BRAND ACTIONS */}
      {selectedBrand && (
        <div style={styles.card}>
          <h4>{selectedBrand.name}</h4>

          <label>Expected Sheets / kg</label>
          <input
            type="number"
            value={expected}
            onChange={e => setExpected(e.target.value)}
            style={styles.input}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={updateExpected}>Save</button>
            <button onClick={deleteBrand} style={styles.danger}>
              Delete
            </button>
          </div>

          {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   Styles
---------------------------- */
const styles = {
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8
  },
  suggestions: {
    border: "1px solid #ddd",
    maxHeight: 200,
    overflowY: "auto"
  },
  suggestion: {
    padding: 8,
    cursor: "pointer"
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px"
  }
};
