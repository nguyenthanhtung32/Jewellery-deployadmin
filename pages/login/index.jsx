import React, { memo, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "../../libraries/axiosClient";
import { useRouter } from "next/navigation";

const Login = (props) => {
  const { setIsLogin } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = {
      email,
      password,
    };

    try {
      const response = await axios.post("/employees/login", account);
      const { token } = response.data;
      const isLocked = response.data.payload.isLocked;

      if (isLocked === true) {
        message.error("Tài khoản của bạn đã bị khóa.");
      } else {
        localStorage.setItem("token", token);

        axios.defaults.headers.Authorization = `Bearer ${token}`;

        const payload = response.data.payload;
        localStorage.setItem("payload", JSON.stringify(payload));

        setIsLogin(true);
        message.success("Đăng nhập thành công");
        const role = response.data.payload.role;
        if (role === "Admin") {
          router.push("/statistical");
        } else {
          router.push("/products");
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Đăng nhập thất bại");
    }
  };

  return (
    <>
      <div className="py-14 flex items-center justify-center">
        <Form
          onSubmit={handleSubmit}
          className="p-4 sm:p-8 shadow-2xl border border-gray sm:w-1/2 "
        >
          <h2 className="mt-2 font-bold text-3xl text-center">Đăng nhập</h2>
          <h4 className="mt-1 py-1 text-black opacity-40 text-center">
            Nhập thông tin đăng nhập để có thể truy cập tài khoản
          </h4>

          <Form.Item
            name="email"
            className="mx-12 pt-2"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ email!",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="h-12"
              prefix={<MailOutlined className="mr-2 text-lg text-primry " />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            className="mx-12"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
                message:
                  "Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password
              className="h-12"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              prefix={<LockOutlined className="mr-2 text-lg text-primry" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item className="text-center mx-12">
            <Button
              type="submit"
              htmlType="submit"
              onClick={handleSubmit}
              className="w-full bg-black hover:bg-gray hover:text-black text-white p-2 h-12 "
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default memo(Login);
