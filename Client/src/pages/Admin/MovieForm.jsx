import { Col, Row, Modal, Form, Input, Select, Button, message } from "antd";
import { InputNumber } from "antd";
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
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={OnFinish}>
        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="movieName"
              rules={[{ required: true, message: "Movie name is required!" }]}
            >
              <Input placeholder="Enter the movie name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <TextArea rows="4" placeholder="Enter the description" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={8}>
                <Form.Item
                  label="Movie Duration (in min)"
                  name="duration"
                  rules={[
                    { required: true, message: "Movie duration is required" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter duration"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Select Movie Language"
                  name="language"
                  rules={[
                    { required: true, message: "Movie language is required!" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Language"
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

              <Col span={8}>
                <Form.Item
                  label="Release Date"
                  name="releaseDate"
                  rules={[
                    {
                      required: true,
                      message: "Movie Release Date is required!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Select Movie Genre"
              name="genre"
              rules={[{ required: true, message: "Movie genre is required!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select Genre"
                options={[
                  { value: "Action", label: "Action" },
                  { value: "Comedy", label: "Comedy" },
                  { value: "Horror", label: "Horror" },
                  { value: "Love", label: "Love" },
                  { value: "Patriot", label: "Patriot" },
                  { value: "Bhakti", label: "Bhakti" },
                  { value: "Thriller", label: "Thriller" },
                  { value: "Mystery", label: "Mystery" },
                  { value: "Drama", label: "Drama" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              label="Poster URL"
              name="poster"
              rules={[{ required: true, message: "Movie Poster is required!" }]}
            >
              <Input placeholder="Enter the poster URL" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >
            Submit the Data
          </Button>

          <Button className="mt-3" block onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieForm;
