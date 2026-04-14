import { theme, buildCardStyles, getThemeColors, icons } from "../../theme";

export default function BarrelInfoCard({ barrel, dark = false }) {
  const colors = getThemeColors(dark);

  if (!barrel) {
    return (
      <div style={{ ...buildCardStyles(dark), ...styles.card }}>
        <div style={styles.header}>
          <div style={styles.icon}>{icons.flask}</div>
          <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Barrel Info</h4>
        </div>
        <p style={{ ...styles.placeholder, color: colors.textMuted }}>Select a barrel</p>
      </div>
    );
  }

  const stock = barrel.current_stock_kg;

  let status = "OK";
  let statusColor = theme.colors.success;
  let iconColor = theme.colors.success;

  if (stock < 20) {
    status = "LOW";
    statusColor = theme.colors.danger;
    iconColor = theme.colors.danger;
  } else if (stock < 50) {
    status = "WARNING";
    statusColor = theme.colors.warning;
    iconColor = theme.colors.warning;
  }

  return (
    <div style={{ ...buildCardStyles(dark), ...styles.card }}>
      <div style={styles.header}>
        <div style={{ ...styles.icon, color: iconColor }}>{icons.flask}</div>
        <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Barrel Info</h4>
      </div>

      <div style={styles.metric}>
        <div style={{ ...styles.largeNumber, color: colors.text }}>{stock}</div>
        <div style={{ ...styles.label, color: colors.textMuted }}>kg remaining</div>
      </div>

      <div style={styles.details}>
        <div style={styles.row}>
          <span style={{ color: colors.textMuted }}>Code</span>
          <strong style={{ color: colors.text }}>{barrel.barrel_code}</strong>
        </div>

        <div style={styles.row}>
          <span style={{ color: colors.textMuted }}>Chemical</span>
          <strong style={{ color: colors.text }}>{barrel.chemical.code}</strong>
        </div>

        <div style={styles.status}>
          <span style={{ background: statusColor, color: theme.colors.background }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.gap,
  },
  icon: {
    fontSize: 20,
  },
  placeholder: {
    ...theme.typography.body,
    textAlign: "center",
    margin: 0,
  },
  metric: {
    textAlign: "center",
    marginBottom: theme.spacing.gap,
  },
  largeNumber: {
    ...theme.typography.pageTitle,
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
  },
  label: {
    ...theme.typography.small,
    marginTop: theme.spacing.tiny,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.tiny,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    ...theme.typography.small,
  },
  status: {
    marginTop: theme.spacing.small,
    textAlign: "center",
  },
};
