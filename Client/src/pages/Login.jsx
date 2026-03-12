import { Form, Input, Button, message, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from '../api/user';
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from '../redux/loaderSlice';
import { useEffect } from "react";
import { GetCurrentUser } from "../api/user";
import { mapErrorToMessage } from "../utils/errorMapper";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();


  /**
   * 🔐 If user already logged in → redirect to home
   * If API throws → user not logged in (stay on login)
   */
  useEffect(() => {
    (async () => {
      try {
        await GetCurrentUser();
        navigate("/", { replace: true });
      } catch {
        // Not logged in — do nothing
      }
    })();
  }, [navigate]);


  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await LoginUser(values);

      messageApi.success(response?.message);

      // Add delay before navigation
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);

    } catch (error) {
      const friendlyMessage = mapErrorToMessage(error);
      messageApi.error(friendlyMessage);
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
          <h2 style={{ marginBottom: 4 }}>Welcome Back</h2>
          <p style={{ margin: 0 }}>
            Login to continue booking your favorite movies
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item style={{ marginTop: "var(--space-4)" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Login
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
          <p style={{ marginBottom: 8 }}>
            New user? <Link to="/register">Register</Link>
          </p>
          <Link to="/forget">Forgot password?</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;