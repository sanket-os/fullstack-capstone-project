import { Form, Input, Button, message, Radio, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser, GetCurrentUser } from '../api/user';
import { useEffect } from "react";
import { mapErrorToMessage } from "../utils/errorMapper";

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await GetCurrentUser();
        navigate("/", { replace: true });
      } catch {
        // Not logged in → stay here
      }
    })();
  }, [navigate]);


  const onFinish = async (values) => {
    try {
      await RegisterUser(values);
      
      messageApi.success("Registration successful");

        // Add delay before navigation
      setTimeout(() => {
        navigate("/login");
      }, 800);
     
    } catch (error) {
      messageApi.error(mapErrorToMessage(error));
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
          width: 460,
          borderRadius: 16,
        }}
      >
        <div style={{ marginBottom: "var(--space-5)", textAlign: "center" }}>
          <h2 style={{ marginBottom: 4 }}>Create Account</h2>
          <p style={{ margin: 0 }}>
            Join BookMyShow and start booking movies
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish} initialValues={{ role: "user" }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input size="large" placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input size="large" type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Register as Partner?"
            name="role"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="user">No</Radio>
              <Radio value="partner">Yes</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: "var(--space-4)" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Register
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
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;



