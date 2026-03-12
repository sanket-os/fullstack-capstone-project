import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, message, Card } from "antd";
import { ForgetPassword } from "../api/user";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";

const Forget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
     
      await ForgetPassword(values);
      
      messageApi.success("OTP sent to your email");
        // alert("OTP sent to your email");
      setTimeout(() => {
        navigate("/reset");
      }, 800);
       
      
    } catch (error) {
     /**
       * Special handling example:
       * If backend says OTP already exists → still redirect user
       */
      if (error.code === "OTP_ALREADY_SENT") {
        message.warning(mapErrorToMessage(error));
        navigate("/reset");
        return;
      }

      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-5)",
        background: "var(--bg-light)",
      }}
    >
      {contextHolder}

      <Card
        variant="borderless"
        style={{
          width: 420,
          borderRadius: 16,
        }}
      >
        <div style={{ marginBottom: "var(--space-5)", textAlign: "center" }}>
          <h2 style={{ marginBottom: 4 }}>Forgot Password</h2>
          <p style={{ margin: 0 }}>
            Enter your email to receive an OTP
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input
              size="large"
              type="email"
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "var(--space-4)" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: "var(--space-4)",
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Remember your password?{" "}
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Forget;