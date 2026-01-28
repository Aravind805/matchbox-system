export default function Sidebar({
  activePage,
  onNavigate,
  role,
  onLogout
}) {
  return (
    <div style={styles.sidebar}>
      {/* BRAND */}
      <div style={styles.brand}>
        <div style={styles.logo}>Velayutham Screen Printers</div>
        <div style={styles.roleBadge}>
          {role.toUpperCase()}
        </div>
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        <div
          style={{
            ...styles.navItem,
            ...(activePage === "entry" ? styles.active : {})
          }}
          onClick={() => onNavigate("entry")}
        >
          🧪 Production Entry
        </div>

        {/* 🔒 ADMIN ONLY */}
        {role === "admin" && (
          <>
            <div
              style={{
                ...styles.navItem,
                ...(activePage === "history" ? styles.active : {})
              }}
              onClick={() => onNavigate("history")}
            >
              📊 Production History
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(activePage === "summary" ? styles.active : {})
              }}
              onClick={() => onNavigate("summary")}
            >
              📈 Production Summary
            </div>
          </>
        )}
      </div>
      <div
  style={{
    ...styles.navItem,
    ...(activePage === "refill" ? styles.active : {})
  }}
  onClick={() => onNavigate("refill")}
>
  🛢️ Chemical Refill
</div>

<div
  style={{
    ...styles.navItem,
    ...(activePage === "brands" ? styles.active : {})
  }}
  onClick={() => onNavigate("brands")}
>
  🏷️ Brand Management
</div>
      {/* FOOTER */}
      <div style={styles.footer}>
        <div style={styles.logout} onClick={onLogout}>
          ⏻ Logout
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
  width: 230,
  background: "linear-gradient(180deg, #0f172a, #020617)",
  color: "#fff",
  padding: 20,
  display: "flex",
  flexDirection: "column"
},
  brand: {
    marginBottom: 24
  },

  logo: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.5
  },

  roleBadge: {
    marginTop: 6,
    display: "inline-block",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 12,
    background: "#2563eb",
    color: "#fff",
    width: "fit-content"
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  navItem: {
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#cbd5e1",
    fontSize: 14,
    transition: "all 0.2s ease"
  },

  active: {
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600
  },

  footer: {
  marginTop: "auto",   // ⬅ this is the correct way
  borderTop: "1px solid rgba(255,255,255,0.1)",
  paddingTop: 16
},
  logout: {
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: 14
  }
};
