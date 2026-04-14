import { useState } from "react";
import { theme, icons, buildCardStyles, buildInputStyles, buildButtonStyles, getThemeColors } from "../theme";

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
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.page}>
        <form style={{ ...buildCardStyles(), ...styles.card }} onSubmit={handleSubmit}>
          <div style={styles.logoContainer}>
            {icons.flame}
            <h1 style={styles.logoText}>Matchbox</h1>
          </div>
          <p style={styles.subtitle}>Enter your credentials</p>

          <div style={styles.inputWrapper}>
            <div style={styles.inputContainer}>
              {icons.user}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={buildInputStyles()}
              />
            </div>
          </div>

          <div style={styles.inputWrapper}>
            <div style={styles.inputContainer}>
              {icons.lock}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={buildInputStyles()}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button style={{ ...buildButtonStyles('primary'), ...styles.submitButton }} disabled={loading}>
            {loading ? (
              <>
                <svg style={styles.spinner} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" values="31.416;0" />
                  </circle>
                </svg>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {error && <div style={styles.errorBanner}>{error}</div>}
        </form>
      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: theme.typography.fontFamily,
  },
  card: {
    width: 360,
    textAlign: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.small,
    color: theme.colors.primary,
  },
  logoText: {
    ...theme.typography.pageTitle,
    margin: 0,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.gap,
  },
  inputWrapper: {
    marginBottom: theme.spacing.gap,
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: theme.colors.textMuted,
    padding: 0,
  },
  submitButton: {
    width: "100%",
    marginTop: theme.spacing.small,
  },
  spinner: {
    width: 16,
    height: 16,
    animation: "spin 1s linear infinite",
  },
  errorBanner: {
    marginTop: theme.spacing.gap,
    padding: theme.spacing.small,
    background: theme.colors.danger,
    color: theme.colors.background,
    borderRadius: theme.borderRadius.button,
    fontSize: theme.typography.small.fontSize,
  },
};
