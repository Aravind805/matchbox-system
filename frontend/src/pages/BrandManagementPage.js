import { useEffect, useState } from "react";
import { theme, buildCardStyles, buildInputStyles, buildButtonStyles, getThemeColors, icons } from "../theme";

export default function BrandManagementPage({ dark = false }) {
  const [brands, setBrands] = useState([]);
  const colors = getThemeColors(dark);

  // add brand
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newExpected, setNewExpected] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editExpected, setEditExpected] = useState("");

  // message
  const [message, setMessage] = useState("");

  /* ---------------------------
     Load brands
  ---------------------------- */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/brands`)
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(console.error);
  }, []);

  /* ---------------------------
     Add brand
  ---------------------------- */
  const addBrand = async () => {
    if (!newName || !newExpected || newExpected <= 0) {
      setMessage("Please enter valid brand details");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/brands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        expected_sheets_per_kg: Number(newExpected)
      })
    });

    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || "Failed to add brand");
      return;
    }

    setBrands(prev => [...prev, json.brand]);
    setNewName("");
    setNewExpected("");
    setShowAddForm(false);
    setMessage("Brand added successfully");
  };

  /* ---------------------------
     Edit brand
  ---------------------------- */
  const startEdit = (brand) => {
    setEditingId(brand.id);
    setEditName(brand.name);
    setEditExpected(brand.expected_sheets_per_kg);
  };

  const saveEdit = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/brands/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          expected_sheets_per_kg: Number(editExpected)
        })
      }
    );

    if (!res.ok) {
      setMessage("Failed to update brand");
      return;
    }

    setBrands(prev =>
      prev.map(b =>
        b.id === editingId
          ? { ...b, name: editName, expected_sheets_per_kg: Number(editExpected) }
          : b
      )
    );

    setEditingId(null);
    setMessage("Brand updated successfully");
  };

  /* ---------------------------
     Delete brand
  ---------------------------- */
  const deleteBrand = async (id) => {
    const ok = window.confirm(
      "Delete this brand permanently?\nThis cannot be undone."
    );
    if (!ok) return;

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/brands/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      setMessage("Failed to delete brand");
      return;
    }

    setBrands(prev => prev.filter(b => b.id !== id));
    setMessage("Brand deleted successfully");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ ...theme.typography.pageTitle, color: colors.text }}>Brand Management</h1>
          <button
            style={buildButtonStyles('primary')}
            onClick={() => setShowAddForm(true)}
          >
            {icons.plus} Add Brand
          </button>
        </div>

        {message && (
          <div style={{
            ...styles.message,
            background: message.includes("successfully") ? theme.colors.success : theme.colors.danger,
          }}>
            {message}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div style={{ ...buildCardStyles(dark), ...styles.addForm }}>
            <h3 style={{ ...theme.typography.sectionHeader, color: colors.text }}>Add New Brand</h3>
            <div style={styles.formRow}>
              <input
                placeholder="Brand name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={buildInputStyles(dark)}
              />
              <input
                type="number"
                placeholder="Expected sheets / kg"
                value={newExpected}
                onChange={e => setNewExpected(e.target.value)}
                style={buildInputStyles(dark)}
              />
            </div>
            <div style={styles.formActions}>
              <button style={buildButtonStyles('secondary')} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button style={buildButtonStyles('primary')} onClick={addBrand}>
                Add Brand
              </button>
            </div>
          </div>
        )}

        {/* Brands Table */}
        <div style={{ ...buildCardStyles(dark), ...styles.tableCard }}>
          <table style={styles.table}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Expected Sheets/kg</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={styles.td}>
                    <div style={{ ...styles.statusDot, background: theme.colors.success }}></div>
                  </td>
                  <td style={styles.td}>
                    {editingId === brand.id ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        style={buildInputStyles(dark)}
                      />
                    ) : (
                      <span style={{ color: colors.text }}>{brand.name}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingId === brand.id ? (
                      <input
                        type="number"
                        value={editExpected}
                        onChange={e => setEditExpected(e.target.value)}
                        style={buildInputStyles(dark)}
                      />
                    ) : (
                      <span style={{ color: colors.text }}>{brand.expected_sheets_per_kg}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {editingId === brand.id ? (
                      <div style={styles.editActions}>
                        <button style={buildButtonStyles('primary')} onClick={saveEdit}>
                          Save
                        </button>
                        <button style={buildButtonStyles('secondary')} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={styles.actions}>
                        <button
                          style={styles.iconButton}
                          onClick={() => startEdit(brand)}
                          title="Edit brand"
                        >
                          {icons.edit}
                        </button>
                        <button
                          style={{ ...styles.iconButton, color: theme.colors.danger }}
                          onClick={() => deleteBrand(brand.id)}
                          title="Delete brand"
                        >
                          {icons.trash}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: theme.spacing.page,
    maxWidth: 1000,
    margin: "0 auto",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.gap,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.button,
    color: theme.colors.background,
    textAlign: "center",
  },
  addForm: {
    marginBottom: theme.spacing.gap,
  },
  formRow: {
    display: "flex",
    gap: theme.spacing.gap,
    marginBottom: theme.spacing.gap,
  },
  formActions: {
    display: "flex",
    gap: theme.spacing.small,
    justifyContent: "flex-end",
  },
  tableCard: {
    overflow: "hidden",
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  actions: {
    display: "flex",
    gap: theme.spacing.tiny,
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: theme.spacing.tiny,
    borderRadius: theme.borderRadius.button,
    color: theme.colors.textMuted,
    transition: theme.transition,
  },
  editActions: {
    display: "flex",
    gap: theme.spacing.tiny,
  },
};
