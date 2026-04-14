import { useEffect, useState } from "react";
import { theme, buildCardStyles, buildButtonStyles, getThemeColors, icons } from "../theme";

function ProductionSummaryPage({ dark = false }) {
  const [range, setRange] = useState("daily");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const colors = getThemeColors(dark);

  useEffect(() => {
    fetchSummary(range);
  }, [range]);

  const fetchSummary = async (selectedRange) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reports/production-summary?range=${selectedRange}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch production summary", err);
    }
    setLoading(false);
  };

  const totalSheets = data.reduce((sum, row) => sum + (row.total_sheets || 0), 0);
  const totalChemical = data.reduce((sum, row) => sum + (row.total_chemical || 0), 0);
  const totalBrands = data.length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...theme.typography.pageTitle, color: colors.text }}>Production Summary</h1>
        </div>

        {/* Range Selector */}
        <div style={styles.rangeSelector}>
          <h3 style={{ ...theme.typography.sectionHeader, color: colors.text }}>Time Range</h3>
          <div style={styles.buttonGroup}>
            <button
              style={buildButtonStyles(range === "daily" ? 'primary' : 'secondary')}
              onClick={() => setRange("daily")}
            >
              Daily
            </button>
            <button
              style={buildButtonStyles(range === "weekly" ? 'primary' : 'secondary')}
              onClick={() => setRange("weekly")}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={{ ...buildCardStyles(dark), ...styles.summaryCard }}>
            <div style={styles.cardIcon}>
              {icons.clipboard}
            </div>
            <div style={styles.cardContent}>
              <h3 style={{ color: colors.text }}>Total Sheets</h3>
              <p style={{ ...styles.metric, color: theme.colors.primary }}>
                {loading ? "..." : totalSheets.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ ...buildCardStyles(dark), ...styles.summaryCard }}>
            <div style={styles.cardIcon}>
              {icons.flask}
            </div>
            <div style={styles.cardContent}>
              <h3 style={{ color: colors.text }}>Total Chemical</h3>
              <p style={{ ...styles.metric, color: theme.colors.secondary }}>
                {loading ? "..." : `${totalChemical.toFixed(1)} kg`}
              </p>
            </div>
          </div>

          <div style={{ ...buildCardStyles(dark), ...styles.summaryCard }}>
            <div style={styles.cardIcon}>
              {icons.brand}
            </div>
            <div style={styles.cardContent}>
              <h3 style={{ color: colors.text }}>Active Brands</h3>
              <p style={{ ...styles.metric, color: theme.colors.success }}>
                {loading ? "..." : totalBrands}
              </p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ ...buildCardStyles(dark), ...styles.tableCard }}>
          <h3 style={{ ...theme.typography.sectionHeader, color: colors.text, marginBottom: theme.spacing.medium }}>
            {range === "daily" ? "Daily" : "Weekly"} Production Details
          </h3>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={{ color: colors.textMuted }}>Loading production data...</p>
            </div>
          ) : data.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>{icons.clipboard}</div>
              <h4 style={{ color: colors.text }}>No Production Data</h4>
              <p style={{ color: colors.textMuted }}>
                No production records found for the selected time range.
              </p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={{ background: colors.surface }}>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Total Sheets</th>
                  <th style={styles.th}>Total Chemical (kg)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={styles.td}>
                      <span style={{ color: colors.text }}>{row.brand}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: colors.text }}>{row.total_sheets?.toLocaleString() || 0}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: colors.text }}>{row.total_chemical?.toFixed(1) || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
  rangeSelector: {
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.gap,
  },
  buttonGroup: {
    display: "flex",
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: theme.spacing.gap,
    marginBottom: theme.spacing.gap,
  },
  summaryCard: {
    padding: theme.spacing.large,
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing.medium,
    minHeight: 120,
  },
  cardIcon: {
    fontSize: "3em",
    color: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.card,
    background: theme.colors.surface,
    marginTop: "-4px",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: "2px",
  },
  metric: {
    fontSize: "2em",
    fontWeight: 700,
    margin: "4px 0 0 0",
  },
  tableCard: {
    padding: theme.spacing.medium,
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.medium,
    padding: theme.spacing.large,
  },
  spinner: {
    width: 40,
    height: 40,
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing.large,
  },
  emptyIcon: {
    fontSize: "3em",
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.medium,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: theme.spacing.small,
    textAlign: "left",
    fontWeight: 600,
    color: theme.colors.text,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  td: {
    padding: theme.spacing.small,
    verticalAlign: "middle",
  },
};

export default ProductionSummaryPage;
