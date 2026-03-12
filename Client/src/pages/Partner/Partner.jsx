import TheatreList from "./TheatreList";
import { Tabs } from "antd";

const Partner = () => {
  const items = [
    {
      key: "theatres",
      label: "My Theatres",
      children: <TheatreList />,
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
      {/* Header */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <h1 style={{ marginBottom: 4 }}>Partner Dashboard</h1>
         <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Manage your theatres and control show schedules
        </p>
      </div>

      {/* Tabs Container */}
      <Tabs
        className="themed-surface"
        defaultActiveKey="theatres"
        size="large"
        items={items}
        style={{
          padding: "var(--space-4)",
          borderRadius: 12,
        }}
      />
    </div>
  );
};

export default Partner;