import { Button, Form, Input, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { ResetPassword } from "../api/user";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";


function Reset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      
      await ResetPassword(values);

      message.success("Password reset successful");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);

      
    } catch (error) {
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
      <Card
        bordered={false}
        style={{
          width: 420,
          borderRadius: 16,
        }}
      >
        <div style={{ marginBottom: "var(--space-5)", textAlign: "center" }}>
          <h2 style={{ marginBottom: 4 }}>Reset Password</h2>
          <p style={{ margin: 0 }}>
            Enter the OTP sent to your email and choose a new password
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: "OTP is required" }]}
          >
            <Input
              size="large"
              inputMode="numeric"
              placeholder="Enter your OTP"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              size="large"
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "var(--space-4)" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}


export default Reset;