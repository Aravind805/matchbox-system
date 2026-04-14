import { useState, useEffect } from "react";
import Header from "./Header";
import { theme, getResponsiveValue } from "../theme";

export default function DashboardLayout({ sidebar, children, user, activePage, dark = false }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.mobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < theme.breakpoints.mobile);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = getResponsiveValue(48, 240);

  return (
    <div style={styles.appShell}>
      {sidebar}
      <div style={{ ...styles.mainArea, marginLeft: sidebarWidth }}>
        <Header user={user} activePage={activePage} dark={dark} />
        <div style={{ ...styles.contentArea, background: dark ? theme.colors.contentBackgroundDark : theme.colors.contentBackground }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  appShell: {
    display: "flex",
    height: "100vh",
    background: theme.colors.contentBackground,
    fontFamily: theme.typography.fontFamily,
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: theme.transition,
  },
  contentArea: {
    flex: 1,
    padding: theme.spacing.page,
    overflowY: "auto",
  },
};

