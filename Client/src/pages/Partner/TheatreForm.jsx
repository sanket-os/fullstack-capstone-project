import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { addTheatre, updateTheatre } from "../../api/theatre";
import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  message,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { mapErrorToMessage } from "../../utils/errorMapper";

const { Title, Text } = Typography;

const TheatreForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  fetchTheatreData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (formType === "edit" && selectedTheatre) {
      form.setFieldsValue(selectedTheatre);
    } else {
      form.resetFields();
    }
  }, [formType, selectedTheatre, form]);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      if (formType === "add") {
        await addTheatre({ ...values, owner: user._id });
        message.success("Theatre added successfully");
      } else {
        await updateTheatre({
          ...values,
          theatreId: selectedTheatre._id,
        });
        message.success("Theatre updated successfully");
      }

      fetchTheatreData();
      handleClose();
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
    form.resetFields();
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleClose}
      width={750}
      footer={null}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          {formType === "add" ? "Add Theatre" : "Edit Theatre"}
        </Title>
        <Text type="secondary">
          {formType === "add"
            ? "Provide theatre details to start hosting shows"
            : "Update theatre information"}
        </Text>
      </div>

      {/* FORM */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[{ required: true, message: "Theatre name is required!" }]}
            >
              <Input size="large" placeholder="Enter theatre name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required!" }]}
            >
              <TextArea rows={3} placeholder="Enter theatre address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required!" }]}
            >
              <Input size="large" type="email" placeholder="Enter email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input size="large" type="tel" placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: "var(--space-5)",
          }}
        >
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button type="primary" htmlType="submit">
            {formType === "add" ? "Create Theatre" : "Update Theatre"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreForm;