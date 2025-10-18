import React from 'react';
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from '../api/user';

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage(); 
  // message.useMessage() is the new Ant Design message system (v5+).
  // messageApi: used to trigger messages like messageApi.success("...").
  // contextHolder: a React element you must include in your JSX (Ant Design needs it to render messages properly).
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response?.success) {
        messageApi.success(response?.message);
        // Add delay before navigation
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        messageApi.warning(response?.message);
      }
    } catch(error) {
      messageApi.error(error);
    }
  };

  return (
    <div className="App-header">
      {contextHolder} 
      <main className='main-area mw-500 text-center px-3'>
        <section>
          <h1>Register to BookMyShow</h1>
        </section>

        <section>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" htmlFor="name" name="name"
              className='d-block' rules={[{ required: true, message: "Name is Required" }]}>
              <Input id="name" type="text" placeholder='Enter you Name' />
            </Form.Item>

            <Form.Item label="Email" htmlFor='email' name="email" 
              className='d-block' 
              rules={[{ required:true, message: "Email is Required"}]}>
              <Input id='email' type='email' 
                placeholder='Enter your Email'></Input>
            </Form.Item>

            <Form.Item label="Password" htmlFor='password' name="password" 
              className='d-block' 
              rules={[{ required:true, message: "Password is Required"}]}>
              <Input id='password' type='password' 
                placeholder='Enter your Password'></Input>
            </Form.Item>          

            <Form.Item>
              <Button type="primary" block htmlFor="submit" htmlType='submit'
                style={{ fontSize: "1rem", fontWeight: "600"}}>
                  Register
              </Button>
            </Form.Item>  
          </Form>
        </section>

        <section>
          <p>
            Already a user ? <Link to="/login">Login Now</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Register;



