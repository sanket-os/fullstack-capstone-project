import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";

import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        /* Brand */
        colorPrimary: "#2563eb",

        /* Background */
        colorBgLayout: "#f8fafc",

        /* Typography */
        colorText: "#111827",
        colorTextSecondary: "#6b7280",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",

        /* Shape */
        borderRadius: 8,

        /* Subtle UI refinement */
        colorBorder: "#e5e7eb",
      },

      components: {
        Button: {
          borderRadius: 8,
          fontWeight: 500,
        },

        Card: {
          borderRadiusLG: 12,
        },

        Layout: {
          headerBg: "#ffffff",
          footerBg: "#ffffff",
        },

        Menu: {
          itemSelectedColor: "#2563eb",
        },
      },
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);