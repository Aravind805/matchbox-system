import { useEffect, useMemo, useState } from "react";
import ProductionHistoryTable from "../components/production/ProductionHistoryTable";
import { theme, buildButtonStyles } from "../theme";

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
        {/* FILTERS */}
        <div style={styles.filtersCard}>
          <div style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Barrel</label>
              <select
                value={barrel}
                onChange={e => setBarrel(e.target.value)}
                style={styles.filterInput}
              >
                <option value="">All Barrels</option>
                {barrels.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Brand</label>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value)}
                style={styles.filterInput}
              >
                <option value="">All Brands</option>
                {brands.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <button style={styles.downloadButton} onClick={downloadCSV}>
            Download CSV
          </button>
        </div>

        {/* TABLE */}
        <ProductionHistoryTable
          entries={filteredEntries}
          onDelete={handleDelete}
          dark={false} // assuming no dark for now, can add later
        />
      </div>
    </div>
  );
}


const styles = {
  page: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  canvas: {
    background: "#ffffff",
    padding: 32,
    borderRadius: 16,
    width: "95%",
    maxWidth: 1200,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.gap,
  },
  filtersCard: {
    background: "#ffffff",
    padding: theme.spacing.card,
    borderRadius: theme.borderRadius.card,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "flex-end",
    gap: theme.spacing.gap,
    flexWrap: "wrap",
  },
  filters: {
    display: "flex",
    gap: theme.spacing.gap,
    flex: 1,
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    minWidth: 120,
  },
  filterLabel: {
    ...theme.typography.small,
    marginBottom: theme.spacing.tiny,
    fontWeight: 500,
    color: theme.colors.text,
  },
  filterInput: {
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.input,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.body.fontSize,
    outline: "none",
  },
  downloadButton: {
    ...buildButtonStyles('secondary'),
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
  
