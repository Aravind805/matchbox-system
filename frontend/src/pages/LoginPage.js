import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      onLogin(data); // ✅ SUCCESS
    } catch {
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Sign in</h2>
        <p style={styles.subtitle}>Enter your credentials</p>

        <div style={styles.inputWrapper}>
  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={e => setUsername(e.target.value)}
    style={styles.textInput}
  />
</div>
        <div style={styles.passwordWrapper}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    style={styles.passwordInput}
  />

  <span
    style={styles.eye}
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>



        <button style={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)"
  },

  card: {
    width: 340,
    padding: 28,
    borderRadius: 16,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
    textAlign: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 18
  },

  input: {
  width: "100%",
  padding: "12px 44px 12px 12px", // ⬅ extra RIGHT padding
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  outline: "none"
},
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  },

  error: {
    marginTop: 10,
    fontSize: 13,
    color: "#dc2626"
  },
  passwordWrapper: {
  position: "relative",
  width: "100%",
  marginBottom: 14
},
eye: {
  position: "absolute",
  right: 14,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: 16,
  color: "#64748b",
  lineHeight: 1
},
passwordInput: {
  width: "100%",
  padding: "12px 46px 12px 12px", // ⬅ space for eye
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" // 🔥 CRITICAL
},
inputWrapper: {
  position: "relative",
  width: "100%",
  marginBottom: 14
},

textInput: {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box", // 🔥 prevents overflow bugs
  background: "#fff"
}
};
