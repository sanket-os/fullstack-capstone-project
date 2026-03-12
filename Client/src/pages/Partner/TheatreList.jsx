import { message, Table, Button, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllTheatres } from "../../api/theatre";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TheatreForm from "./TheatreForm";
import ShowModal from "./ShowModal";
import DeleteTheatreModal from "./DeleteTheatreModal";
import { mapErrorToMessage } from "../../utils/errorMapper";

const { Text } = Typography;

const TheatreList = () => {
  const dispatch = useDispatch();

  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("add");

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatres();
      setTheatres(response.data);
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Theatre",
      dataIndex: "name",
      render: (_, data) => (
        <div>
          <Text strong>{data.name}</Text>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {data.address}
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      render: (_, data) => (
        <div>
          <div>{data.email}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {data.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, data) =>
        data.isActive ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending / Blocked</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_, data) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              setFormType("edit");
              setSelectedTheatre(data);
            }}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedTheatre(data);
            }}
          />

          {data.isActive && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsShowModalOpen(true);
                setSelectedTheatre(data);
              }}
            >
              Shows
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <div>
          <Text type="secondary">
            Manage your theatres and show schedules
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
            setSelectedTheatre(null);
            setFormType("add");
          }}
        >
          Add Theatre
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="_id"
        dataSource={theatres}
        columns={columns}
        bordered
        pagination={{ pageSize: 6 }}
        locale={{
          emptyText: "No theatres added yet.",
        }}
      />

      {/* MODALS */}
      {isModalOpen && (
        <TheatreForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          fetchTheatreData={getData}
          formType={formType}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteTheatreModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          fetchTheatreData={getData}
        />
      )}

      {isShowModalOpen && (
        <ShowModal
          isShowModalOpen={isShowModalOpen}
          setIsShowModalOpen={setIsShowModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
    </div>
  );
};

export default TheatreList;