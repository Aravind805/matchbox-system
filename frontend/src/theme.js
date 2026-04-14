// src/theme.js
// Shared theme constants for the Matchbox UI overhaul

export const theme = {
  // Colors
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#64748b',
    danger: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    background: '#ffffff',
    backgroundDark: '#0f172a',
    contentBackground: '#f1f5f9',
    contentBackgroundDark: '#1e293b',
    sidebar: '#0f172a',
    text: '#1e293b',
    textDark: '#f1f5f9',
    textMuted: '#64748b',
    textMutedDark: '#94a3b8',
    border: '#e2e8f0',
    borderDark: '#334155',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    shadowDark: '0 1px 3px rgba(0,0,0,0.3)',
  },

  // Typography
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    pageTitle: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.2,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.3,
    },
    body: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.4,
    },
    small: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },

  // Spacing
  spacing: {
    page: 24,
    card: 16,
    gap: 16,
    small: 8,
    tiny: 4,
  },

  // Border radius
  borderRadius: {
    card: 12,
    input: 10,
    button: 8,
  },

  // Transitions
  transition: 'all 0.15s ease',

  // Breakpoints
  breakpoints: {
    mobile: 768,
  },
};

// Utility functions
export const getResponsiveValue = (mobile, desktop) => {
  return window.innerWidth < theme.breakpoints.mobile ? mobile : desktop;
};

export const getThemeColors = (dark = false) => {
  return {
    background: dark ? theme.colors.backgroundDark : theme.colors.background,
    contentBackground: dark ? theme.colors.contentBackgroundDark : theme.colors.contentBackground,
    text: dark ? theme.colors.textDark : theme.colors.text,
    textMuted: dark ? theme.colors.textMutedDark : theme.colors.textMuted,
    border: dark ? theme.colors.borderDark : theme.colors.border,
    shadow: dark ? theme.colors.shadowDark : theme.colors.shadow,
  };
};

// Common style builders
export const buildCardStyles = (dark = false) => ({
  background: getThemeColors(dark).background,
  borderRadius: theme.borderRadius.card,
  padding: theme.spacing.card,
  boxShadow: getThemeColors(dark).shadow,
  transition: theme.transition,
});

export const buildInputStyles = (dark = false) => ({
  width: '100%',
  padding: 12,
  borderRadius: theme.borderRadius.input,
  border: `1px solid ${getThemeColors(dark).border}`,
  fontSize: theme.typography.body.fontSize,
  outline: 'none',
  transition: theme.transition,
  background: getThemeColors(dark).background,
  color: getThemeColors(dark).text,
  boxSizing: 'border-box',
});

export const buildButtonStyles = (variant = 'primary', dark = false) => {
  const base = {
    padding: '10px 20px',
    borderRadius: theme.borderRadius.button,
    border: 'none',
    fontSize: theme.typography.body.fontSize,
    fontWeight: 600,
    cursor: 'pointer',
    transition: theme.transition,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.tiny,
  };

  const variants = {
    primary: {
      background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      color: theme.colors.background,
    },
    secondary: {
      background: 'transparent',
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`,
    },
    danger: {
      background: theme.colors.danger,
      color: theme.colors.background,
    },
  };

  return { ...base, ...variants[variant] };
};

export const buildTableStyles = (dark = false) => ({
  width: '100%',
  borderCollapse: 'collapse',
  background: getThemeColors(dark).background,
  color: getThemeColors(dark).text,
  borderRadius: theme.borderRadius.card,
  overflow: 'hidden',
  boxShadow: getThemeColors(dark).shadow,
});

// SVG Icons (inline)
export const icons = {
  flame: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
      <path d="M12 6L12.5 10L16 10.5L12.5 11L12 15L11.5 11L8 10.5L11.5 10L12 6Z" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
      <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  clipboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 2H15V6H9V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V19C3 20.1046 3.89543 21 5 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 13L12 8L16 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  flask: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L9 15L7 15C5.89543 15 5 15.8954 5 17V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V17C19 15.8954 18.1046 15 17 15L15 15L15 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 7L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 11L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  tag: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9625 21.1666 11.4686 21.1666 12C21.1666 12.5314 20.9625 13.0375 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25391 13.9205C2.88188 12.252 2.99274 10.5121 3.57346 8.9043C4.15418 7.29651 5.18081 5.88737 6.53323 4.84175C7.88565 3.79614 9.50784 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85853 7.68141C9.98321 9.35337 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  door: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 22H5C3.89543 22 3 21.1046 3 20V4C3 2.89543 3.89543 2 5 2H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3 20.5304 3 20V6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  brand: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};