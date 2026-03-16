import { useEffect, useState } from "react";
import { Layout, Menu, Spin, Dropdown, Button, Tooltip } from "antd";
import logoLight from "../assets/bookmyshow-logo.svg";
import logoDark from "../assets/dark_logo.svg";

import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../api/user";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";
import { axiosInstance } from "../api/index";
import { mapErrorToMessage } from "../utils/errorMapper";
import { useTheme } from "../theme/themeContext";

import { Content, Footer, Header } from "antd/es/layout/layout";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const { isDark, toggleTheme } = useTheme();
 const logoSrc = isDark ? logoLight : logoDark;

  useEffect(() => {
    getValidUser();
  }, []);


  const getValidUser = async () => {
    try {
      dispatch(showLoading());

      const response = await GetCurrentUser();
      console.log('API Response:', response); // Debug log

      dispatch(setUser(response?.data));

    } catch (error) {
      /**
          * If session invalid → redirect silently
          * No scary error message needed
      */
      dispatch(setUser(null));
      navigate("/login", { replace: true });

      // Optional debug:
      console.warn("Session expired:", mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
      setAuthChecked(true); // ✅ mark auth complete
    }
  };


  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch {
      // Even if logout fails, force logout locally
      // silent fail
    } finally {
      dispatch(setUser(null));
      navigate("/login", { replace: true });
      window.location.reload(); // optional but useful in payment apps
    }
  };


  if (!authChecked) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    navigate("/", { replace: true });
    return null;
  }


  return (
    <Layout style={{ minHeight: "100vh", background: "var(--bg-light)" }}>

      {/* HEADER */}
      <Header
        style={{
          height: 64,
          background: "var(--card-bg)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-5)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: "transparent",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logoSrc}
              alt="BookMyShow"
              style={{
                height: isDark ? 36 : 34,
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* CENTER NAV */}
        <Menu
          mode="horizontal"
          selectable={false}
          style={{
            borderBottom: "none",
            flex: 1,
            justifyContent: "center",
            background: "transparent",
          }}
          items={[
            {
              key: "home",
              icon: <HomeOutlined />,
              label: "Home",
              onClick: () => navigate("/"),
            },
            {
              key: "role",
              icon: <ProfileOutlined />,
              label:
                user?.role === "admin"
                  ? "Admin"
                  : user?.role === "partner"
                    ? "Partner"
                    : "My Bookings",
              onClick: () => {
                if (user?.role === "admin") navigate("/admin");
                else if (user?.role === "partner") navigate("/partner");
                else navigate("/mybookings");
              },
            },
          ]}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            <Button
              className="theme-toggle-btn"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            >
              {isDark ? "Light" : "Dark"}
            </Button>
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: handleLogout,
                },
              ],
            }}
            placement="bottomRight"
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 500,
              }}
            >
              <UserOutlined />
              {user?.name}
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* CONTENT */}
      <Content
        style={{
          padding: "var(--space-6) var(--space-3)",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {children}
      </Content>

      {/* FOOTER */}
      <Footer
        style={{
          textAlign: "center",
          // background: "#ffffff",
          background: "var(--card-bg)",
          borderTop: "1px solid var(--border)",
          color: "var(--text-secondary)",
          padding: "var(--space-3)",
        }}
      >
        © {new Date().getFullYear()} BookMyShow — Capstone Project
      </Footer>
    </Layout>
  );
};

export default ProtectedRoute;

