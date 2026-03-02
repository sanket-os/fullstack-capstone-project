import { Col, Row, Modal, Form, Input, Select, Button, message, Divider, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { addMovie, updateMovie } from "../../api/movie";
import { useEffect } from "react";
import { mapErrorToMessage } from "../../utils/errorMapper";

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  FetchMovieData,
  formType,
  selectedMovie,
  setSelectedMovie,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const OnFinish = async (values) => {
    try {
      dispatch(showLoading());

      const payload = {
      ...values,
      releaseDate: new Date(values.releaseDate).toISOString().split("T")[0],
    };

      if (formType === "edit") {
        await updateMovie({
          ...payload,
          movieId: selectedMovie._id,
        });

        message.success("Movie updated successfully");
      } else {
        await addMovie(
          payload
        );
        message.success("Movie added successfully");
      }

      FetchMovieData();
      setIsModalOpen(false);
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
      setSelectedMovie(null);
    }
  };

  /**
   * Prefill data when editing
   */
useEffect(() => {
  if (formType === "edit" && selectedMovie) {
    form.setFieldsValue({
      ...selectedMovie,
      releaseDate: selectedMovie.releaseDate
        ?.toString()
        .split("T")[0],
    });
  } else {
    form.resetFields();
  }
}, [selectedMovie, formType]);



  return (
    <Modal
      centered
      title={
        <span style={{ fontWeight: 600 }}>
          {formType === "add" ? "Add Movie" : "Edit Movie"}
        </span>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      width={820}
      footer={null}
      styles={{
        body: {
          paddingTop: "var(--space-5)",
          paddingBottom: "var(--space-6)",
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={OnFinish}>
        {/* Basic Info */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="movieName"
              rules={[{ required: true, message: "Movie name is required" }]}
            >
              <Input size="large" placeholder="Enter movie name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea
                rows={4}
                placeholder="Enter movie description"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Movie Details */}
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Duration is required" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                placeholder="120"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Languages"
              name="language"
              rules={[{ required: true, message: "Select language(s)" }]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Select languages"
                options={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Punjabi", label: "Punjabi" },
                  { value: "Telugu", label: "Telugu" },
                  { value: "Bengali", label: "Bengali" },
                  { value: "German", label: "German" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[{ required: true, message: "Release date is required" }]}
            >
              <Input type="date" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Genres"
              name="genre"
              rules={[{ required: true, message: "Select genre(s)" }]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Select genres"
                options={[
                  { value: "Action", label: "Action" },
                  { value: "Comedy", label: "Comedy" },
                  { value: "Horror", label: "Horror" },
                  { value: "Love", label: "Love" },
                  { value: "Thriller", label: "Thriller" },
                  { value: "Mystery", label: "Mystery" },
                  { value: "Drama", label: "Drama" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Poster */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Poster URL"
              name="poster"
              rules={[{ required: true, message: "Poster URL is required" }]}
            >
               {/* <Input placeholder="Enter the poster URL" /> */}
              <Input size="large" placeholder="Enter the poster URL" />
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <div
          style={{
            marginTop: "var(--space-6)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-3)",
          }}
        >
          <Button
            onClick={handleCancel}
            size="large"
            style={{ borderRadius: 8 }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ borderRadius: 8 }}
          >
            {formType === "add" ? "Add Movie" : "Update Movie"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};


export default MovieForm;
