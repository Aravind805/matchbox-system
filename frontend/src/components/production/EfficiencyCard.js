import { theme, buildCardStyles, getThemeColors, icons } from "../../theme";

export default function EfficiencyCard({ expected, actual, dark = false }) {
  const colors = getThemeColors(dark);

  if (actual == null) {
    return (
      <div style={{ ...buildCardStyles(dark), ...styles.card }}>
        <div style={styles.header}>
          <div style={styles.icon}>{icons.chart}</div>
          <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Efficiency</h4>
        </div>
        <p style={{ ...styles.placeholder, color: colors.textMuted }}>Submit a production entry</p>
      </div>
    );
  }

  const efficiency = ((actual / expected) * 100).toFixed(1);

  let status = "GOOD";
  let statusColor = theme.colors.success;
  let iconColor = theme.colors.success;

  if (actual < expected * 0.8) {
    status = "POOR";
    statusColor = theme.colors.danger;
    iconColor = theme.colors.danger;
  } else if (actual < expected) {
    status = "AVERAGE";
    statusColor = theme.colors.warning;
    iconColor = theme.colors.warning;
  }

  return (
    <div style={{ ...buildCardStyles(dark), ...styles.card }}>
      <div style={styles.header}>
        <div style={{ ...styles.icon, color: iconColor }}>{icons.chart}</div>
        <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Efficiency</h4>
      </div>

      <div style={styles.metric}>
        <div style={{ ...styles.largeNumber, color: colors.text }}>{efficiency}%</div>
        <div style={{ ...styles.label, color: colors.textMuted }}>efficiency rate</div>
      </div>

      <div style={styles.statusBadge}>
        <span style={{ background: statusColor, color: theme.colors.background, borderRadius: theme.borderRadius.button, padding: "6px 16px", fontWeight: 600, fontSize: "0.9em" }}>
          {status}
        </span>
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
  statusBadge: {
    marginTop: theme.spacing.medium,
    textAlign: "center",
  },
};
