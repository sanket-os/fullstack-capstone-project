import MovieTable from "./MovieTable";
import TheatreTable from './TheatreTable';
import { Tabs } from "antd";

const Admin = () => {

  const tabItems = [
    {
      key: "movies",
      label: "Movies",
      children: <MovieTable />
    },
    {
      key: "theatre",
      label: "Theatre",
      children: <TheatreTable />,
    },
  ];

  return (
    <div style={{ margin: "10px" }}>
      <h1>Admin Dashboard</h1>
      <Tabs 
        defaultActiveKey='movies' 
        items={tabItems}
        style={{ margin: "10px" }}  
      ></Tabs>
    </div>
  );
}

export default Admin;

// admin has 2 roles
// manage movie
// manage theatre (approve/ban)