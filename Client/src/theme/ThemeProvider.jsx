import { ConfigProvider, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const contextValue = useMemo(
    () => ({ isDark, toggleTheme }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: "#2563eb",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
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
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}