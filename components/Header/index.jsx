import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useRouter } from "next/router";
import HomePage from "@/pages/home";

function Header(props) {
  const { setIsLogin } = props;
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("payload");
    setIsLogin(false);
    setIsLoggedIn(false);
    message.success("Đăng xuất thành công!!!");
    router.push("/");
  };

  return (
    <div>
      <div className="flex items-center justify-between h-[125px]  shadow-md">
        <div className="flex">
          <img
            src="/img/5.png"
            alt="user"
            title="jewellery-logo"
            className="w-3/4 ml-16"
          />
        </div>
        {isLoggedIn && (
          <Button
            type="button"
            className="bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black font-thin mr-8"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        )}
      </div>
      {isLoggedIn && <HomePage />}
    </div>
  );
}

export default Header;
