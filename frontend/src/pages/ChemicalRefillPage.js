import { useEffect, useState } from "react";
import { theme, buildCardStyles, buildInputStyles, buildButtonStyles, getThemeColors, icons } from "../theme";

export default function ChemicalRefillPage({ dark = false }) {
  const [barrels, setBarrels] = useState([]);
  const [refillAmounts, setRefillAmounts] = useState({});
  const [message, setMessage] = useState("");
  const colors = getThemeColors(dark);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/barrels`)
      .then(res => res.json())
      .then(setBarrels)
      .catch(console.error);
  }, []);

  const submitRefill = async (barrelId) => {
    const addedKg = refillAmounts[barrelId];
    if (!addedKg || addedKg <= 0) {
      setMessage("Please enter a valid amount");
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
        setMessage(json.error || "Refill failed");
        return;
      }

      setBarrels(prev =>
        prev.map(b =>
          b.id === barrelId
            ? { ...b, current_stock_kg: json.new_stock }
            : b
        )
      );

      setRefillAmounts(prev => ({ ...prev, [barrelId]: "" }));
      setMessage(`Refill successful. New stock: ${json.new_stock} kg`);
    } catch (err) {
      console.error(err);
      setMessage("Error during refill");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...theme.typography.pageTitle, color: colors.text }}>Chemical Refill</h1>
        </div>

        {message && (
          <div style={{
            ...styles.message,
            background: message.includes("successful") ? theme.colors.success : theme.colors.danger,
          }}>
            {message}
          </div>
        )}

        <div style={styles.barrelsGrid}>
          {barrels.map(barrel => {

            return (
              <div key={barrel.id} style={styles.barrelContainer}>
                <div style={{ ...buildCardStyles(dark), ...styles.barrelCard }}>
                  <div style={styles.barrelHeader}>
                    <div style={styles.barrelInfo}>
                      <h3 style={{ ...theme.typography.sectionHeader, color: colors.text }}>
                        {barrel.barrel_code}
                      </h3>
                      <span style={{ color: colors.textMuted, fontSize: "0.9em" }}>
                        {barrel.brand_name}
                      </span>
                    </div>
                    <div style={styles.stockBadge}>
                      <span style={{ color: theme.colors.text, fontWeight: 600 }}>
                        {barrel.current_stock_kg} / {barrel.capacity_kg} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.refillSection}>
                  <input
                    type="number"
                    placeholder="Amount to add (kg)"
                    value={refillAmounts[barrel.id] || ""}
                    onChange={e => setRefillAmounts(prev => ({
                      ...prev,
                      [barrel.id]: e.target.value
                    }))}
                    style={buildInputStyles(dark)}
                  />
                  <button
                    style={buildButtonStyles('primary')}
                    onClick={() => submitRefill(barrel.id)}
                    disabled={!refillAmounts[barrel.id] || refillAmounts[barrel.id] <= 0}
                  >
                    {icons.plus} Refill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: theme.spacing.page,
    maxWidth: 1200,
    margin: "0 auto",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.gap,
  },
  header: {
    marginBottom: theme.spacing.gap,
  },
  message: {
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.button,
    color: theme.colors.background,
    textAlign: "center",
  },
  barrelsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: theme.spacing.gap,
  },
  barrelContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.medium,
  },
  barrelCard: {
    padding: theme.spacing.large,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  barrelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.medium,
  },
  barrelInfo: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.tiny,
  },
  stockBadge: {
    fontSize: "0.9em",
  },
  refillSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.small,
    alignItems: "stretch",
  },
};