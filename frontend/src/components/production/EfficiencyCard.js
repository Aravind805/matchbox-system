export default function EfficiencyCard({ expected, actual }) {
  if (actual == null) {
    return (
      <div style={styles.card}>
        <h4 style={styles.title}>Efficiency</h4>
        <p style={styles.placeholder}>Submit a production entry</p>
      </div>
    );
  }

  const variance = (actual - expected).toFixed(2);

  let status = "GOOD";
  let color = "#16a34a";

  if (actual < expected * 0.8) {
    status = "POOR";
    color = "#dc2626";
  } else if (actual < expected) {
    status = "AVERAGE";
    color = "#f59e0b";
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.title}>Efficiency</h4>
        <span style={{ ...styles.badge, background: color }}>
          {status}
        </span>
      </div>

      <div style={styles.row}>
        <span>Expected</span>
        <strong>{expected}%</strong>
      </div>

      <div style={styles.row}>
        <span>Actual</span>
        <strong>{actual}%</strong>
      </div>

      <div style={styles.row}>
        <span>Variance</span>
        <strong>{variance}%</strong>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginTop: 16
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    fontSize: 15,
    fontWeight: 600
  },
  placeholder: {
    fontSize: 13,
    color: "#64748b"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 6
  },
  badge: {
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600
  }
};
