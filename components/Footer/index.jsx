import React from "react";

function Footer() {
  return (
    <div className="bottom-0 fixed-auto w-full bg-black py-3">
      <div className="flex justify-center items-center">
        <img
          src="/img/2.png"
          alt="user"
          title="jewellery-logo"
          className="w-48"
        />
        <span className="text-white font-light" style={{ width: "41%" }}>
          © 2017 Công Ty Cổ Phần Trang Sức Hải Châu Giấy chứng nhận đăng ký
          doanh nghiệp do Sở Kế hoạch & Đầu tư Đà Nẵng cấp lần đầu ngày
          01/01/2010. Ngành, nghề kinh doanh.
        </span>
      </div>
    </div>
  );
}
export default Footer;
