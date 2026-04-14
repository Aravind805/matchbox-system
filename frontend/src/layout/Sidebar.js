import { useState, useEffect } from "react";
import { theme, icons, getThemeColors, getResponsiveValue } from "../theme";

export default function Sidebar({
  activePage,
  onNavigate,
  role,
  onLogout,
  dark = false,
  onToggleDark
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.mobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < theme.breakpoints.mobile);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = getResponsiveValue(48, 240);

  const navItems = [
    { key: "entry", label: "Production Entry", icon: icons.clipboard, adminOnly: false },
    { key: "history", label: "History", icon: icons.clock, adminOnly: true },
    { key: "summary", label: "Summary", icon: icons.chart, adminOnly: true },
    { key: "refill", label: "Chemical Refill", icon: icons.flask, adminOnly: true },
    { key: "brands", label: "Brands", icon: icons.tag, adminOnly: true },
  ];

  return (
    <div style={{ ...styles.sidebar, width, background: theme.colors.sidebar }}>
      {/* BRAND */}
      <div style={styles.brand}>
        {icons.flame}
        {!isMobile && <div style={styles.logo}>Matchbox</div>}
        {!isMobile && (
          <div style={styles.roleBadge}>
            {role.toUpperCase()}
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        {navItems.map(item => {
          if (item.adminOnly && role !== "admin") return null;
          const isActive = activePage === item.key;
          return (
            <div
              key={item.key}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.active : {}),
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
              onClick={() => onNavigate(item.key)}
            >
              {item.icon}
              {!isMobile && <span>{item.label}</span>}
            </div>
          );
        })}
      </div>

      {/* BOTTOM */}
      <div style={styles.bottom}>
        <button
          style={styles.toggleButton}
          onClick={onToggleDark}
        >
          {dark ? icons.sun : icons.moon}
        </button>
        <div
          style={{
            ...styles.navItem,
            ...styles.logout,
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}
          onClick={onLogout}
        >
          {icons.door}
          {!isMobile && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    transition: theme.transition,
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    zIndex: 100,
  },
  brand: {
    padding: theme.spacing.card,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.small,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    fontSize: 18,
    fontWeight: 600,
    flex: 1,
  },
  roleBadge: {
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 8,
    background: theme.colors.primary,
    color: "#fff",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.tiny,
    padding: theme.spacing.card,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.small,
    padding: "10px 12px",
    borderRadius: theme.borderRadius.button,
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: theme.typography.body.fontSize,
    transition: theme.transition,
  },
  active: {
    background: theme.colors.primary,
    color: "#fff",
    fontWeight: 500,
  },
  bottom: {
    marginTop: "auto",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    padding: theme.spacing.card,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.small,
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: theme.spacing.tiny,
    borderRadius: theme.borderRadius.button,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: theme.transition,
  },
  logout: {
    color: "#94a3b8",
  },
};
