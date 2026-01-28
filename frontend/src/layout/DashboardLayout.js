//import Sidebar from "./Sidebar";
//import Header from "./Header";
import "../styles/layout.css";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="app-shell">
      {sidebar}
      <div className="main-area">
        {children}
      </div>
    </div>
  );
}

