import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, message, Input, Tag } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllTheatresForAdmin, updateTheatre } from "../../api/theatre";
import { mapErrorToMessage } from "../../utils/errorMapper";
import { SearchOutlined } from "@ant-design/icons";


const TheatreTable = () => {
  const dispatch = useDispatch();
  const [theatres, setTheatres] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getData = async () => {
    try {
      dispatch(showLoading());

      const response = await getAllTheatresForAdmin();

      setTheatres(response.data);

    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };


  const handleStatusChange = async (theatre) => {
    try {
      dispatch(showLoading());

      const values = {
        theatreId: theatre._id,
        isActive: !theatre.isActive,
      };

      await updateTheatre(values);

      message.success(
        theatre.isActive
          ? "Theatre blocked successfully"
          : "Theatre approved successfully",
      );

      getData();

    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };


  useEffect(() => {
    getData();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredTheatres = useMemo(() => {
    return theatres.filter((theatre) =>
      theatre.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [theatres, searchText]);


  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (_, data) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {data.owner?.name}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {data.email}
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      render: (_, data) =>
        data.isActive ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending / Blocked</Tag>
        ),
    },
    {
      title: "Actions",
      width: 140,
      render: (_, data) => (
        <Button
          type={data.isActive ? "default" : "primary"}
          danger={data.isActive}
          size="small"
          onClick={() => handleStatusChange(data)}
        >
          {data.isActive ? "Block" : "Approve"}
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
         background: "var(--card-bg)",
        padding: "var(--space-5)",
        borderRadius: 12,
         border: "1px solid var(--border)",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "var(--space-4)",
        }}
      >
        <Input
          placeholder="Search theatres..."
          prefix={<SearchOutlined />}
          style={{ width: 260 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* ===== TABLE ===== */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredTheatres}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default TheatreTable;