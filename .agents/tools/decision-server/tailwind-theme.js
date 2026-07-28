/* Minimal Tailwind bridge — prefer .ss-* in styles.css */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0d0d0d", mute: "#667085", line: "#e5e5e5", wash: "#f7f7f8" },
        accent: { DEFAULT: "#10a37f", soft: "#e7f6f1" },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: { content: "42rem" },
      borderRadius: { panel: "8px" },
    },
  },
};
