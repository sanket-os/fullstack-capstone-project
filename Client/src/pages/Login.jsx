import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from '../api/user';
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from '../redux/loaderSlice';
import { useEffect } from "react";
import { GetCurrentUser } from "../api/user";
import { mapErrorToMessage } from "../utils/errorMapper";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage(); // Add this
  // this is the new way of showing notification msg in antd v5 & React 19
  // we use this to showcase msg at the top with additional delay to view msg
  // otherwise the fast rendering will skip it
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
      } catch (error) {
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
      }, 1200);

    } catch (error) {
      const friendlyMessage = mapErrorToMessage(error);
      messageApi.error(friendlyMessage);
    } finally {
      dispatch(hideLoading());
    }
  };


  return (
    <div className='App-header'>
      {contextHolder} {/* Add this */}

      <main className='main-area mw-500 text-center px-3'>

        <section>
          <h1>Login to BookMyShow</h1>
        </section>

        <section>
          <Form layout='vertical' onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor='email'
              name="email"
              className='d-block'
              rules={[{ required: true, message: "Email is Required" }]}>

              <Input id='email' type='email' placeholder='Enter your Email'></Input>
            </Form.Item>

            <Form.Item
              label="Password"
              htmlFor='password'
              name="password"
              className='d-block'
              rules={[{ required: true, message: "Password is Required" }]}>

              <Input id='password' type='password' placeholder='Enter your Password'></Input>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block htmlFor="submit"
                htmlType='submit'
                style={{ fontSize: "1rem", fontWeight: "600" }}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </section>

        <section>
          <p>
            New User ? <Link to="/register">Register Here</Link>
          </p>

          <p>
            Forgot Password? <Link to="/forget">Click Here</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Login;