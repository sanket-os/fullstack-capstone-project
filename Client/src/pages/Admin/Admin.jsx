import MovieTable from "./MovieTable";
import TheatreTable from "./TheatreTable";
import { Tabs } from "antd";

const Admin = () => {
  const tabItems = [
    {
      key: "movies",
      label: "Movie Management",
      children: <MovieTable />,
    },
    {
      key: "theatres",
      label: "Theatre Management",
      children: <TheatreTable />,
    },
  ];

  return (
    <div
      style={{
        padding: "var(--space-6) var(--space-4)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <h1 style={{ marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Manage movies and control theatre approvals
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="movies"
        items={tabItems}
        size="large"
        style={{
          background: "#ffffff",
          padding: "var(--space-4)",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
        }}
      />
    </div>
  );
};

export default Admin;

// admin has 2 roles
// manage movie
// manage theatre (approve/ban)