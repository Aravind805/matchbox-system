export default function SheetPerformanceCard({ actualSheets }) {
  // If nothing submitted yet
  if (actualSheets == null) {
    return (
      <div style={styles.card}>
        <h4 style={styles.title}>Production Output</h4>
        <p style={styles.placeholder}>Submit a production entry</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Production Output</h4>

      <div style={styles.row}>
        <span>Actual Sheets Produced</span>
        <strong>{actualSheets}</strong>
      </div>
    </div>
  );
}

/* ---------------------------
   Styles
---------------------------- */
const styles = {
  card: {
    background: "#ffffff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 8
  },
  placeholder: {
    fontSize: 13,
    color: "#64748b"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14
  },
  title: {
  fontSize: 14,
  fontWeight: 600,
  color: "#334155"
},
row: {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
  padding: "6px 0"
}
};
