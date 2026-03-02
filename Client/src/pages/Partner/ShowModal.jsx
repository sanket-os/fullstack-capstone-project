import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  addShow,
  deleteShow,
  getAllShowsByTheatre,
  updateShow,
} from "../../api/show";
import { useDispatch } from "react-redux";
import { getAllMovies } from "../../api/movie";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { mapErrorToMessage } from "../../utils/errorMapper";

const { Title, Text } = Typography;

const ShowModal = ({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
  setSelectedTheatre,
}) => {
  const dispatch = useDispatch();

  const [view, setView] = useState("table");
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [movies, setMovies] = useState([]);

  const handleCancel = () => {
    setIsShowModalOpen(false);
    setSelectedTheatre(null);
    setView("table");
    setSelectedShow(null);
  };

  const getData = async () => {
    try {
      dispatch(showLoading());

      const movieResponse = await getAllMovies();
      setMovies(movieResponse.data);

      const showResponse = await getAllShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      setShows(showResponse.data);
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const payload = {
        ...values,
        theatre: selectedTheatre._id,
        ticketPrice: Number(values.ticketPrice),
        totalSeats: Number(values.totalSeats),
      };

      if (view === "add") {
        await addShow(payload);
        message.success("Show added successfully");
      } else {
        await updateShow({
          ...payload,
          showId: selectedShow._id,
        });
        message.success("Show updated successfully");
      }

      setView("table");
      getData();
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(showLoading());
      await deleteShow({ showId });
      message.success("Show deleted successfully");
      getData();
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Show",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time) => moment(time, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (_, data) => data.movie.movieName,
    },
    {
      title: "Price",
      dataIndex: "ticketPrice",
      render: (price) => `₹${price}`,
    },
    {
      title: "Seats",
      render: (_, data) =>
        `${data.totalSeats - data.bookedSeats.length} / ${data.totalSeats}`,
    },
    {
      title: "Actions",
      render: (_, data) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setView("edit");
              setSelectedShow({
                ...data,
                date: moment(data.date).format("YYYY-MM-DD"),
                movie: data.movie._id,
              });
            }}
          />
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(data._id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (selectedTheatre?._id) {
      getData();
    }
  }, [selectedTheatre]);

  return (
    <Modal
      centered
      open={isShowModalOpen}
      onCancel={handleCancel}
      width={1100}
      footer={null}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          {selectedTheatre?.name}
        </Title>
        <Text type="secondary">
          {view === "table"
            ? "Manage show schedules"
            : view === "add"
            ? "Create a new show"
            : "Update show details"}
        </Text>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <>
          <div style={{ marginBottom: "var(--space-4)", textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setView("add")}
            >
              Add Show
            </Button>
          </div>

          <Table
            rowKey="_id"
            columns={columns}
            dataSource={shows}
            bordered
            pagination={{ pageSize: 6 }}
          />
        </>
      )}

      {/* FORM VIEW */}
      {(view === "add" || view === "edit") && (
        <Form
          layout="vertical"
          initialValues={view === "edit" ? selectedShow : null}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Show Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true }]}
              >
                <Input type="time" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Movie"
                name="movie"
                rules={[{ required: true }]}
              >
                <Select
                  options={movies.map((movie) => ({
                    value: movie._id,
                    label: movie.movieName,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ticket Price"
                name="ticketPrice"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Total Seats"
                name="totalSeats"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setView("table")}
            >
              Back
            </Button>

            <Button type="primary" htmlType="submit">
              {view === "add" ? "Create Show" : "Update Show"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ShowModal;