export default function BarrelInfoCard({ barrel }) {
  if (!barrel) {
    return (
      <div style={styles.card}>
        <h4 style={styles.title}>Barrel Info</h4>
        <p style={styles.placeholder}>Select a barrel</p>
      </div>
    );
  }

  const stock = barrel.current_stock_kg;

  let status = "OK";
  let color = "#16a34a";

  if (stock < 20) {
    status = "LOW";
    color = "#dc2626";
  } else if (stock < 50) {
    status = "WARNING";
    color = "#f59e0b";
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.title}>Barrel Info</h4>
        <span style={{ ...styles.status, background: color }}>
          {status}
        </span>
      </div>

      <div style={styles.row}>
        <span>Code</span>
        <strong>{barrel.barrel_code}</strong>
      </div>

      <div style={styles.row}>
        <span>Chemical</span>
        <strong>{barrel.chemical.code}</strong>
      </div>

      <div style={styles.row}>
        <span>Stock</span>
        <strong>{stock} kg</strong>
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
    maxWidth: 360
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
  status: {
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600
  }
};
