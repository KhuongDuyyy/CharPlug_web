import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--cp-background)",
        foreground: "var(--cp-foreground)",
        surface: "var(--cp-surface)",
        "surface-alt": "var(--cp-surface-alt)",
        "surface-full": "var(--cp-surface-full)",
        accent: "var(--cp-accent)",
        "accent-soft": "var(--cp-accent-soft)",
        "accent-soft-2": "var(--cp-accent-soft-2)",
        border: "var(--cp-border)",
        divider: "var(--cp-divider)",
        input: "var(--cp-input)",
        muted: "var(--cp-muted)",
        "muted-light": "var(--cp-muted-light)",
        "on-accent": "var(--cp-on-accent)",
        available: "var(--cp-available)",
        "available-soft": "var(--cp-available-soft)",
        success: "var(--cp-success)",
        "success-soft": "var(--cp-success-soft)",
        warning: "var(--cp-warning)",
        "warning-soft": "var(--cp-warning-soft)",
        danger: "var(--cp-danger)",
        "danger-soft": "var(--cp-danger-soft)",
        info: "var(--cp-info)",
        "info-soft": "var(--cp-info-soft)",
        "session-stable": "var(--cp-session-stable)",
        "session-stable-soft": "var(--cp-session-stable-soft)",
        "session-warning": "var(--cp-session-warning)",
        "session-warning-soft": "var(--cp-session-warning-soft)",
        "session-danger": "var(--cp-session-danger)",
        "session-danger-soft": "var(--cp-session-danger-soft)",
        "shadow-base": "var(--cp-shadow-base)"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"SF Pro Text\"",
          "\"SF Pro Display\"",
          "Roboto",
          "\"Segoe UI\"",
          "system-ui",
          "sans-serif"
        ]
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        xl: ["20px", { lineHeight: "30px" }],
        logo: ["30px", { lineHeight: "40px" }]
      },
      borderRadius: {
        card: "28px",
        sheet: "32px"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
        glass: "0 18px 40px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
