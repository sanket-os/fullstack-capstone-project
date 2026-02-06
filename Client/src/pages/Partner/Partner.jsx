import TheatreList from "./TheatreList";
import { Tabs } from 'antd';

const Partner = () => {

  const items = [
  {
    key: "theatres",
    label: "Theatres",
    children: <TheatreList />,
  },
];

  return (
    <div style={{ margin: "10px" }}>
      <h1>Partner Dashboard</h1>
      <Tabs items={items} />
    </div>
  );
;}

export default Partner;