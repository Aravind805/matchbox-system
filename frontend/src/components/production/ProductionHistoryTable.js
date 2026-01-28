export default function ProductionHistoryTable({ entries, onDelete, role }) {
  const isAdmin = role === "admin";

  return (
    <div style={styles.card}>
      {/* HEADER */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.colDate}>Date</th>
            <th style={styles.colBarrel}>Barrel</th>
            <th style={styles.colBrand}>Brand</th>
            <th style={styles.colChemical}>Chemical (kg)</th>
            <th style={styles.colSheets}>Sheets</th>
            {isAdmin && <th style={styles.colActions}>Actions</th>}
          </tr>
        </thead>
      </table>

      {/* BODY */}
      <div style={styles.bodyWrapper}>
        <table style={styles.table}>
          <tbody>
            {entries.map((e) => {
              const ratio =
                e.expected_sheets > 0
                  ? e.sheets_produced / e.expected_sheets
                  : null;

              let rowStyle = {};
              let title = "";

              if (ratio !== null) {
                if (ratio < 0.7) {
                  rowStyle = styles.critical;
                  title = "Critical loss (<70%)";
                } else if (ratio < 0.9) {
                  rowStyle = styles.warning;
                  title = "Below expected (70–90%)";
                } else if (ratio > 1.1) {
                  rowStyle = styles.excellent;
                  title = "Exceptional (>110%)";
                }
              }

              return (
                <tr key={e.id} style={rowStyle} title={title}>
                  <td style={styles.colDate}>{e.created_at}</td>
                  <td style={styles.colBarrel}>{e.barrel}</td>
                  <td style={styles.colBrand}>{e.brand}</td>
                  <td style={{ ...styles.colChemical, textAlign: "right" }}>
                    {e.chemical_used_kg}
                  </td>
                  <td style={{ ...styles.colSheets, textAlign: "right" }}>
                    {e.sheets_produced}
                  </td>

                  {isAdmin && (
                    <td style={styles.colActions}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => onDelete(e.id)}
                        title="Delete production entry"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------
   Styles
---------------------------- */
const styles = {
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
  },
  bodyWrapper: {
    maxHeight: 420,
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderTop: "none"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  },
  colDate: {
    width: "180px",
    padding: "8px 12px",
    whiteSpace: "nowrap"
  },
  colBarrel: {
    width: "80px",
    padding: "8px 12px"
  },
  colBrand: {
    width: "220px",
    padding: "8px 12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  colChemical: {
    width: "120px",
    padding: "8px 12px"
  },
  colSheets: {
    width: "100px",
    padding: "8px 12px"
  },
  colActions: {
    width: "80px",
    padding: "8px 12px",
    textAlign: "center"
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px"
  },
  critical: { background: "#fee2e2" },
  warning: { background: "#fef3c7" },
  excellent: { background: "#dcfce7" }
};
