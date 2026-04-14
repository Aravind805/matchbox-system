import { theme, buildTableStyles, getThemeColors, icons } from "../../theme";

export default function ProductionHistoryTable({ entries, onDelete, dark = false }) {
  const colors = getThemeColors(dark);

  if (!entries.length) {
    return (
      <div style={{ ...buildTableStyles(dark), ...styles.emptyState }}>
        <div style={styles.emptyIcon}>{icons.clipboard}</div>
        <h3 style={{ ...styles.emptyTitle, color: colors.text }}>No Production Records</h3>
        <p style={{ ...styles.emptyText, color: colors.textMuted }}>
          Production entries will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div style={{ ...buildTableStyles(dark), ...styles.tableContainer }}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
              <th style={styles.colDate}>Date</th>
              <th style={styles.colBarrel}>Barrel</th>
              <th style={styles.colBrand}>Brand</th>
              <th style={styles.colChemical}>Chemical (kg)</th>
              <th style={styles.colSheets}>Sheets</th>
              <th style={styles.colEfficiency}>Efficiency</th>
              <th style={styles.colActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const ratio = e.expected_sheets > 0 ? (e.sheets_produced / e.expected_sheets) * 100 : 0;
              let badgeColor = theme.colors.success;
              let badgeText = "Good";

              if (ratio < 80) {
                badgeColor = theme.colors.danger;
                badgeText = "Poor";
              } else if (ratio < 100) {
                badgeColor = theme.colors.warning;
                badgeText = "Average";
              } else {
                badgeText = "Excellent";
              }

              return (
                <tr key={e.id} style={{ ...styles.row, background: colors.background }}>
                  <td style={{ ...styles.colDate, color: colors.text }}>{e.created_at}</td>
                  <td style={{ ...styles.colBarrel, color: colors.text }}>{e.barrel}</td>
                  <td style={{ ...styles.colBrand, color: colors.text }}>{e.brand}</td>
                  <td style={{ ...styles.colChemical, color: colors.text, textAlign: "right" }}>
                    {e.chemical_used_kg}
                  </td>
                  <td style={{ ...styles.colSheets, color: colors.text, textAlign: "right" }}>
                    {e.sheets_produced}
                  </td>
                  <td style={styles.colEfficiency}>
                    <span style={{ ...styles.badge, background: badgeColor }}>
                      {badgeText}
                    </span>
                  </td>
                  <td style={styles.colActions}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => onDelete(e.id)}
                      title="Delete production entry"
                    >
                      {icons.trash}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  tableContainer: {
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: theme.typography.body.fontSize,
  },
  row: {
    borderBottom: `1px solid ${theme.colors.border}`,
    transition: theme.transition,
  },
  colDate: {
    padding: theme.spacing.small,
    whiteSpace: "nowrap",
    minWidth: 120,
  },
  colBarrel: {
    padding: theme.spacing.small,
    minWidth: 80,
  },
  colBrand: {
    padding: theme.spacing.small,
    minWidth: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  colChemical: {
    padding: theme.spacing.small,
    minWidth: 100,
    textAlign: "right",
  },
  colSheets: {
    padding: theme.spacing.small,
    minWidth: 80,
    textAlign: "right",
  },
  colEfficiency: {
    padding: theme.spacing.small,
    minWidth: 100,
    textAlign: "center",
  },
  colActions: {
    padding: theme.spacing.small,
    textAlign: "center",
    minWidth: 60,
  },
  badge: {
    color: theme.colors.background,
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: theme.typography.small.fontSize,
    fontWeight: 600,
    display: "inline-block",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: theme.colors.danger,
    padding: theme.spacing.tiny,
    borderRadius: theme.borderRadius.button,
    transition: theme.transition,
  },
  emptyState: {
    padding: theme.spacing.page,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.gap,
  },
  emptyIcon: {
    fontSize: 48,
    color: theme.colors.textMuted,
  },
  emptyTitle: {
    ...theme.typography.sectionHeader,
    margin: 0,
  },
  emptyText: {
    ...theme.typography.body,
    margin: 0,
  },
};
