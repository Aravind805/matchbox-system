import { useState, useEffect } from "react";
import ProductionForm from "../components/production/ProductionForm";
import BarrelInfoCard from "../components/production/BarrelInfoCard";
import EfficiencyCard from "../components/production/EfficiencyCard";
import SheetPerformanceCard from "../components/production/SheetPerformanceCard";
import { theme, getResponsiveValue } from "../theme";

export default function ProductionEntryPage({ dark = false }) {
  const [selectedBarrel, setSelectedBarrel] = useState(null);
  const [productionResult, setProductionResult] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.mobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < theme.breakpoints.mobile);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const expectedSheets = productionResult?.expectedSheets || null;

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.canvas,
        gridTemplateColumns: isMobile ? "1fr" : "520px 360px",
        gap: isMobile ? theme.spacing.gap : 32,
      }}>
        {/* LEFT */}
        <ProductionForm
          onBarrelChange={setSelectedBarrel}
          onProductionResult={setProductionResult}
          dark={dark}
        />

        {/* RIGHT */}
        <div style={styles.right}>
          <BarrelInfoCard barrel={selectedBarrel} dark={dark} />
          <EfficiencyCard
            expected={expectedSheets}
            actual={productionResult?.actualSheets}
            dark={dark}
          />
          <SheetPerformanceCard
            actualSheets={productionResult?.actualSheets}
            dark={dark}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  canvas: {
    background: "#ffffff",
    padding: 32,
    borderRadius: 16,
    width: getResponsiveValue("95%", 920),
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "grid",
    alignItems: "start",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.gap,
  },
};
