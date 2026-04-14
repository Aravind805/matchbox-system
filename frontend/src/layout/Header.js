import { theme, getThemeColors } from "../theme";

const pageTitles = {
  entry: "Production Entry",
  history: "Production History",
  summary: "Production Summary",
  refill: "Chemical Refill",
  brands: "Brand Management",
};

export default function Header({ user, activePage, dark = false }) {
  const colors = getThemeColors(dark);

  return (
    <header style={{ ...styles.header, background: colors.background, borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ ...styles.title, color: colors.text }}>
        {pageTitles[activePage] || "Dashboard"}
      </div>
      <div style={styles.meta}>
        <span style={{ ...styles.userName, color: colors.text }}>
          {user?.name || "User"}
        </span>
        <span style={styles.roleBadge}>
          {user?.role?.toUpperCase() || "USER"}
        </span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing.page}px`,
  },
  title: {
    ...theme.typography.sectionHeader,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.small,
  },
  userName: {
    ...theme.typography.body,
  },
  roleBadge: {
    ...theme.typography.small,
    padding: "2px 8px",
    borderRadius: 12,
    background: theme.colors.primary,
    color: theme.colors.background,
    fontWeight: 600,
  },
};
