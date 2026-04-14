import { theme, buildCardStyles, getThemeColors, icons } from "../../theme";

export default function SheetPerformanceCard({ actualSheets, dark = false }) {
  const colors = getThemeColors(dark);

  if (actualSheets == null) {
    return (
      <div style={{ ...buildCardStyles(dark), ...styles.card }}>
        <div style={styles.header}>
          <div style={styles.icon}>{icons.clipboard}</div>
          <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Production Output</h4>
        </div>
        <p style={{ ...styles.placeholder, color: colors.textMuted }}>Submit a production entry</p>
      </div>
    );
  }

  return (
    <div style={{ ...buildCardStyles(dark), ...styles.card }}>
      <div style={styles.header}>
        <div style={styles.icon}>{icons.clipboard}</div>
        <h4 style={{ ...theme.typography.body, color: colors.text, fontWeight: 600 }}>Production Output</h4>
      </div>

      <div style={styles.metric}>
        <div style={{ ...styles.largeNumber, color: colors.text }}>{actualSheets}</div>
        <div style={{ ...styles.label, color: colors.textMuted }}>sheets produced</div>
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
    color: theme.colors.primary,
  },
  placeholder: {
    ...theme.typography.body,
    textAlign: "center",
    margin: 0,
  },
  metric: {
    textAlign: "center",
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
};
