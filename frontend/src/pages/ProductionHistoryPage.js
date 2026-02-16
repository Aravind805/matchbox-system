import { useEffect, useMemo, useState } from "react";
import ProductionHistoryTable from "../components/production/ProductionHistoryTable";

export default function ProductionHistoryPage() {
  const [entries, setEntries] = useState([]);

  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [barrel, setBarrel] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/production-entries`)
      .then(res => res.json())
      .then(setEntries)
      .catch(console.error);
  }, []);

  /* ---------------------------
     DELETE HANDLER (ADMIN)
  ---------------------------- */
  const handleDelete = async (entryId) => {
    const ok = window.confirm(
      "Are you sure? This will restore stock and permanently delete the entry."
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/production-entry/${entryId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Failed to delete production entry");
        return;
      }

      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting entry");
    }
  };

  /* ---------------------------
     Filtered entries
  ---------------------------- */
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (fromDate && e.created_at < fromDate) return false;
      if (toDate && e.created_at > toDate + " 23:59") return false;
      if (barrel && e.barrel !== barrel) return false;
      if (brand && e.brand !== brand) return false;
      return true;
    });
  }, [entries, fromDate, toDate, barrel, brand]);

  /* ---------------------------
     CSV Export
  ---------------------------- */
  const downloadCSV = () => {
    if (!filteredEntries.length) return;

    const headers = [
      "Date",
      "Barrel",
      "Brand",
      "Chemical Used (kg)",
      "Sheets Produced",
      "Expected Sheets"
    ];

    const rows = filteredEntries.map(e => [
      e.created_at,
      e.barrel,
      e.brand,
      e.chemical_used_kg,
      e.sheets_produced,
      e.expected_sheets
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "production_history_filtered.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const barrels = [...new Set(entries.map(e => e.barrel))];
  const brands = [...new Set(entries.map(e => e.brand))];

  return (
    <div style={styles.page}>
      <div style={styles.canvas}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2>Production History</h2>
          <button style={styles.button} onClick={downloadCSV}>
            Download CSV
          </button>
        </div>

        {/* LEGEND */}
        <div style={styles.legend}>
          <span style={{ background: "#dcfce7" }}>Excellent</span>
          <span style={{ background: "#fef3c7" }}>Below Expected</span>
          <span style={{ background: "#fee2e2" }}>Critical</span>
        </div>

        {/* FILTERS */}
        <div style={styles.filters}>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

          <select value={barrel} onChange={e => setBarrel(e.target.value)}>
            <option value="">All Barrels</option>
            {barrels.map(b => <option key={b}>{b}</option>)}
          </select>

          <select value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* TABLE */}
        <ProductionHistoryTable
          entries={filteredEntries}
          role="admin"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}


/* ---------------------------
   Styles
---------------------------- */
const styles = {
  page: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  canvas: {
    background: "#fff",
    padding: 32,
    borderRadius: 16,
    width: 1000,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16
  },
  filters: {
    display: "flex",
    gap: 12,
    marginBottom: 12
  },
  toggles: {
    display: "flex",
    gap: 20,
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 24
  },
  summaryCard: {
    background: "#f8fafc",
    padding: 16,
    borderRadius: 10
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginTop: 6
  },
  legend: {
  display: "flex",
  gap: 12,
  marginBottom: 12,
  fontSize: 12
},
  empty: {
    fontSize: 13,
    color: "#64748b"
  }
};
