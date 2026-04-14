import { useState } from "react";

import DashboardLayout from "./layout/DashboardLayout";
import ProductionEntryPage from "./pages/ProductionEntryPage";
import ProductionHistoryPage from "./pages/ProductionHistoryPage";
import Sidebar from "./layout/Sidebar";
import LoginPage from "./pages/LoginPage";
import ProductionSummaryPage from "./pages/ProductionSummaryPage";
import ChemicalRefillPage from "./pages/ChemicalRefillPage";
import BrandManagementPage from "./pages/BrandManagementPage";

function App() {
  const [user, setUser] = useState(null);      // 🔐 LOGIN STATE
  const [activePage, setActivePage] = useState("entry");
  const [dark, setDark] = useState(false);

  // 🔓 NOT LOGGED IN → SHOW LOGIN
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  // 🔐 LOGGED IN → SHOW DASHBOARD
  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          role={user.role}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
          onLogout={() => setUser(null)}
        />
      }
      user={user}
      activePage={activePage}
      dark={dark}
    >
      {activePage === "entry" && <ProductionEntryPage dark={dark} />}

      {/* 🔒 ADMIN ONLY */}
      {activePage === "history" && user.role === "admin" && (
        <ProductionHistoryPage dark={dark} />
      )}
      {activePage === "summary" && user.role === "admin" && (
        <ProductionSummaryPage dark={dark} />
      )}
      {activePage === "refill" && user.role === "admin" && (
        <ChemicalRefillPage dark={dark} />
      )}
      {activePage === "brands" && user.role === "admin" && (
        <BrandManagementPage dark={dark} />
      )}
    </DashboardLayout>
  );
}

export default App;
