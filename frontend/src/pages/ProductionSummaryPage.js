import { useEffect, useState } from "react";

function ProductionSummaryPage() {
  const [range, setRange] = useState("daily");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSummary(range);
  }, [range]);

  const fetchSummary = async (selectedRange) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/reports/production-summary?range=${selectedRange}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch production summary", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Production Summary</h2>

      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setRange("daily")}
          disabled={range === "daily"}
        >
          Daily
        </button>

        <button
          onClick={() => setRange("weekly")}
          disabled={range === "weekly"}
          style={{ marginLeft: "10px" }}
        >
          Weekly
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Total Sheets</th>
              <th>Total Chemical (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3">No data</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.brand}</td>
                  <td>{row.total_sheets}</td>
                  <td>{row.total_chemical}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductionSummaryPage;
