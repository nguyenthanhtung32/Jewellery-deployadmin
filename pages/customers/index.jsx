import React, { memo, useState, useEffect } from "react";
import { Table, message, Space } from "antd";
import { LockIcon, UnlockIcon } from "lucide-react";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";
import Moment from "moment";
const { Column } = Table;

const apiName = "/customers";

function ManageCustomers() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axiosClient
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const lockCustomers = (customersId) => {
    axiosClient
      .post(apiName + `/${customersId}/lock`)
      .then(() => {
        setRefresh((f) => f + 1);
        message.success("Khóa thành công!", 1.5);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const unlockCustomers = (customersId) => {
    axiosClient
      .post(apiName + `/${customersId}/unlock`)
      .then(() => {
        setRefresh((f) => f + 1);
        message.success("Mở khóa thành công!", 1.5);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl text-center my-3">Danh Sách Khách Hàng</h1>
      <Table dataSource={data} rowKey="_id" scroll={{ x: true }}>
        <Column
          title="STT"
          render={(_text, _record, index) => {
            return <span>{index + 1}</span>;
          }}
        />
        <Column title="Họ" dataIndex="firstName" key="firstName" />
        <Column title="Tên" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Số điện thoại"
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Column title="Địa chỉ" dataIndex="address" key="address" />
        <Column
          title="Ngày sinh"
          dataIndex="birthday"
          key="birthday"
          render={(text) => {
            return <span>{Moment(text).format("DD/MM/YYYY")}</span>;
          }}
        />
        <Column title="Giới tính" dataIndex="gender" key="gender" />
        <Column
          title="Avatar"
          dataIndex="avatarUrl"
          key="avatarUrl"
          render={(avatarUrl, record) => (
            <img
              src={`${API_URL}/${avatarUrl}`}
              alt={`Avatar-${record._id}`}
              style={{ width: 50, height: 50 }}
            />
          )}
        />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          render={(status) => (
            <span>
              {status ? (
                <div className="flex items-center text-red font-extrabold">
                  KHÓA
                </div>
              ) : (
                <div className="flex items-center text-green font-extrabold">
                  MỞ
                </div>
              )}
            </span>
          )}
        />
        <Column
          title="Hành động"
          key="action"
          render={(record) => (
            <Space size="middle">
              {!record.status && (
                <button
                  className="w-full flex justify-between items-center text-black py-1 px-1 rounded-md border-2 border-black hover:bg-gray hover:text-black"
                  onClick={() => lockCustomers(record._id)}
                >
                  <LockIcon className="mr-2" size={20} strokeWidth={1} />
                  Khóa
                </button>
              )}
              {record.status && (
                <button
                  className="w-full flex justify-between items-center text-black py-1 px-1 rounded-md border-2 border-black hover:bg-gray hover:text-black"
                  onClick={() => unlockCustomers(record._id)}
                >
                  <UnlockIcon className="mr-2" size={20} strokeWidth={1} />
                  Mở
                </button>
              )}
            </Space>
          )}
        />
      </Table>
    </div>
  );
}

export default memo(ManageCustomers);
