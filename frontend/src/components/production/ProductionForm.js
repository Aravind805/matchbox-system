import React, { useEffect, useRef, useState } from "react";
import { theme, buildCardStyles, buildInputStyles, buildButtonStyles, getThemeColors, icons } from "../../theme";

export default function ProductionForm({
  onBarrelChange,
  onProductionResult,
  dark = false
}) {
  const [barrels, setBarrels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const [barrelId, setBarrelId] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [brandId, setBrandId] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const [chemicalUsedKg, setChemicalUsedKg] = useState("");
  const [sheetsProduced, setSheetsProduced] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const brandBoxRef = useRef(null);

  const colors = getThemeColors(dark);

  /* ---------------------------

  /* ---------------------------
     Fetch barrels & brands
  ---------------------------- */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/barrels`)
      .then(res => res.json())
      .then(setBarrels);

    fetch(`${process.env.REACT_APP_API_URL}/api/brands`)
      .then(res => res.json())
      .then(setBrands);
  }, []);

  /* ---------------------------
     Brand autocomplete filter
  ---------------------------- */
  useEffect(() => {
    const filtered = brands.filter(b =>
      b.name.toLowerCase().includes(brandInput.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [brandInput, brands]);

  /* ---------------------------
     Close dropdown on outside click
  ---------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (brandBoxRef.current && !brandBoxRef.current.contains(e.target)) {
        setShowBrandDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------------
     Submit production entry
  ---------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");


    if (!barrelId || !brandId || !chemicalUsedKg || !sheetsProduced) {
      setMessage("❌ Please fill all fields correctly");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/production-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barrel_id: Number(barrelId),
          brand_id: Number(brandId),
          chemical_used_kg: Number(chemicalUsedKg),
          sheets_produced: Number(sheetsProduced)
        })
      });

      const data = await res.json();

      if (!res.ok) {
  setMessage("❌ " + data.error);
  return;
}

setMessage(`✅ Saved successfully`);

const selectedBrand = brands.find(b => b.id === brandId);
const expectedSheets = selectedBrand ? Number(data.chemical_used_kg ?? chemicalUsedKg) * selectedBrand.expected_sheets_per_kg : null;

onProductionResult?.({
  actualSheets: Number(data.sheets_produced ?? sheetsProduced),
  chemicalUsedKg: Number(data.chemical_used_kg ?? chemicalUsedKg),
  expectedSheets: expectedSheets
});


      // Reset form
      setBarrelId("");
      setBrandInput("");
      setBrandId(null);
      setChemicalUsedKg("");
      setSheetsProduced("");

    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    barrelId && brandId && chemicalUsedKg && sheetsProduced;

  return (
    <div style={{ ...buildCardStyles(dark), ...styles.card }}>
      <h2 style={{ ...theme.typography.sectionHeader, color: colors.text, marginBottom: theme.spacing.gap }}>
        Production Entry
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Barrel */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: colors.text }}>Barrel</label>
          <select
            value={barrelId}
            onChange={(e) => {
              const value = e.target.value;
              setBarrelId(value);
              const barrel = barrels.find(b => b.id === Number(value));
              onBarrelChange?.(barrel);
            }}
            style={buildInputStyles(dark)}
          >
            <option value="">Select Barrel</option>
            {barrels.map(b => (
              <option key={b.id} value={b.id}>
                {b.barrel_code} — {b.chemical.code} ({b.current_stock_kg} kg)
              </option>
            ))}
          </select>
        </div>

        {/* Brand autocomplete */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: colors.text }}>Brand</label>
          <div ref={brandBoxRef} style={styles.dropdownWrapper}>
            <input
              type="text"
              placeholder="Select brand"
              value={brandInput}
              onFocus={() => setShowBrandDropdown(true)}
              onChange={(e) => {
                setBrandInput(e.target.value);
                setBrandId(null);
              }}
              style={buildInputStyles(dark)}
            />

            {showBrandDropdown && (
              <div style={{ ...styles.dropdown, background: colors.background, borderColor: colors.border }}>
                {filteredBrands.length === 0 && (
                  <div style={{ ...styles.noItem, color: colors.textMuted }}>No brands found</div>
                )}
                {filteredBrands.map(b => (
                  <div
                    key={b.id}
                    style={{ ...styles.item, color: colors.text, borderBottomColor: colors.border }}
                    onClick={() => {
                      setBrandInput(b.name);
                      setBrandId(b.id);
                      setShowBrandDropdown(false);
                    }}
                  >
                    {b.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, color: colors.text }}>Chemical Used (kg)</label>
          <input
            type="number"
            step="0.01"
            value={chemicalUsedKg}
            onChange={(e) => setChemicalUsedKg(e.target.value)}
            style={buildInputStyles(dark)}
          />
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, color: colors.text }}>Sheets Produced</label>
          <input
            type="number"
            value={sheetsProduced}
            onChange={(e) => setSheetsProduced(e.target.value)}
            style={buildInputStyles(dark)}
          />
        </div>

        <button
          type="submit"
          style={{
            ...buildButtonStyles('primary'),
            width: '100%',
            marginTop: theme.spacing.small,
            opacity: isFormValid && !submitting ? 1 : 0.6
          }}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Saving..." : "Submit"}
        </button>

        {message && (
          <div style={{
            ...styles.messageBanner,
            background: message.startsWith("✅") ? theme.colors.success : theme.colors.danger,
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 360,
    zIndex: 1,
  },
  field: {
    marginBottom: theme.spacing.gap,
  },
  label: {
    display: "block",
    marginBottom: theme.spacing.tiny,
    fontSize: theme.typography.small.fontSize,
    fontWeight: 500,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 5,
  },
  dropdown: {
    position: "absolute",
    width: "100%",
    borderRadius: theme.borderRadius.input,
    maxHeight: 160,
    overflowY: "auto",
    zIndex: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  item: {
    padding: theme.spacing.small,
    cursor: "pointer",
    borderBottom: `1px solid ${theme.colors.border}`,
    transition: theme.transition,
  },
  noItem: {
    padding: theme.spacing.small,
    textAlign: "center",
  },
  messageBanner: {
    marginTop: theme.spacing.gap,
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.button,
    color: theme.colors.background,
    fontSize: theme.typography.small.fontSize,
    textAlign: "center",
  },
};
