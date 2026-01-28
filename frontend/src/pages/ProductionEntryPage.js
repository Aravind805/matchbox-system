import { useState } from "react";

import ProductionForm from "../components/production/ProductionForm";
import BarrelInfoCard from "../components/production/BarrelInfoCard";
import SheetPerformanceCard from "../components/production/SheetPerformanceCard";

export default function ProductionEntryPage() {
  const [selectedBarrel, setSelectedBarrel] = useState(null);
  const [productionResult, setProductionResult] = useState(null);

  const expectedSheets =
    productionResult && productionResult.expectedSheetsPerKg
      ? productionResult.chemicalUsedKg *
        productionResult.expectedSheetsPerKg
      : null;

  return (
    <div style={styles.page}>
      <div style={styles.canvas}>
        <div style={styles.grid}>
          {/* LEFT */}
          <ProductionForm
            onBarrelChange={setSelectedBarrel}
            onProductionResult={setProductionResult}
          />

          {/* RIGHT */}
          <div style={styles.right}>
            <BarrelInfoCard barrel={selectedBarrel} />

            <SheetPerformanceCard
              expectedSheets={expectedSheets}
              actualSheets={productionResult?.actualSheets}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Layout Styles
---------------------------- */
const styles = {
  page: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },

  canvas: {
    background: "#ffffff",
    padding: 32,
    borderRadius: 16,
    width: 920,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "520px 360px",
    gap: 32,
    alignItems: "start"
  },

  right: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
};
