import { ConfigProvider, theme } from "antd";
import { useState, useEffect } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,

        token: {
          colorPrimary: "#2563eb",
          fontFamily:
            "Inter, system-ui, -apple-system, sans-serif",
          borderRadius: 10,
          borderRadiusLG: 14,
        },

        components: {
          Button: {
            borderRadius: 8,
            fontWeight: 500,
          },
          Card: {
            borderRadiusLG: 14,
          },
          Layout: {
            headerBg: "transparent",
            footerBg: "transparent",
          },
        },
      }}
    >
      {children({ toggleTheme, isDark })}
    </ConfigProvider>
  );
}