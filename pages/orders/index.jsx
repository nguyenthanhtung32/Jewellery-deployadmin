import React, { memo, useState, useEffect } from "react";
import {
  Table,
  message,
  Form,
  Modal,
  Select,
  Space,
  Button,
  Popconfirm,
} from "antd";
import { API_URL } from "@/constants";
import numeral from "numeral";
import Moment from "moment";
import { CircleXIcon, EyeIcon, FilePenLine } from "lucide-react";
import axiosClient from "@/libraries/axiosClient";

const { Column } = Table;

const apiName = "/orders";

function ManageOrder() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [updateForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  useEffect(() => {
    axiosClient
      .get("/employees")
      .then((response) => {
        const { data } = response;
        setEmployees(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  useEffect(() => {
    axiosClient
      .get("/products")
      .then((response) => {
        const { data } = response;
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onUpdateFinish = (values) => {
    axiosClient
      .patch(apiName + "/" + updateId, values)
      .then((_response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công", 1.5);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axiosClient.patch(`/orders/${orderId}`, {
        status: "CANCELED",
      });

      if (response.status === 200) {
        await axiosClient.patch(`/orders/return-stock/${orderId}`);
        setRefresh((prevRefresh) => prevRefresh + 1);
      } else {
        console.error("Có lỗi xảy ra khi hủy đơn hàng");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu hủy đơn hàng", error);
    }
  };

  const text = "Xác nhận hủy đơn hàng ?";

  return (
    <div>
      <h1 className="text-2xl text-center my-3">Danh Sách Đơn Hàng</h1>
      <Table
        dataSource={data}
        rowKey="_id"
        scroll={{ x: true }}
        className="w-full"
      >
        <Column
          title="STT"
          render={(_text, _record, index) => {
            return <span>{index + 1}</span>;
          }}
        />
        <Column
          title="Khách hàng"
          key="customerName"
          render={(_text, record) => {
            return (
              <span>{`${record.customer.firstName} ${record.customer.lastName}`}</span>
            );
          }}
        />
        <Column title="Email" dataIndex="emailOrder" key="emailOrder" />
        <Column
          title="Số điện thoại"
          dataIndex="phoneNumberOrder"
          key="phoneNumberOrder"
        />
        <Column
          title="Ngày đặt"
          dataIndex="createdDate"
          key="createdDate"
          render={(text) => {
            return <span>{Moment(text).format("DD/MM/YYYY")}</span>;
          }}
        />
        <Column
          title="Ngày đặt"
          dataIndex="shippedDate"
          key="shippedDate"
          render={(text) => {
            return <span>{Moment(text).format("DD/MM/YYYY")}</span>;
          }}
        />
        <Column
          title="Địa chỉ giao"
          dataIndex="shippingAddress"
          key="shippingAddress"
          render={(text, record) => {
            return <span>{`${record.shippingAddress}`}</span>;
          }}
        />
        <Column
          title="Phương thức"
          dataIndex="paymentType"
          key="paymentType"
          render={(text) => {
            let paymentText = "";
            switch (text) {
              case "CASH":
                paymentText = "Tiền mặt";
                break;
              case "CREDIT CARD":
                paymentText = "Chuyển khoản";
                break;
              case "VNPAY":
                paymentText = "VNPAY";
                break;
              default:
                paymentText = text;
                break;
            }
            return <span>{paymentText}</span>;
          }}
        />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          render={(text) => {
            let statusText = "";
            switch (text) {
              case "COMPLETE":
                statusText = "Đã mua";
                break;
              case "CANCELED":
                statusText = "Đã hủy";
                break;
              case "APPROVED":
                statusText = "Đã duyệt";
                break;
              case "WAITING":
                statusText = "Đang đợi duyệt";
                break;
              default:
                statusText = text;
                break;
            }
            return <span>{statusText}</span>;
          }}
        />
        <Column
          title="Nhân viên"
          dataIndex="employee"
          key="employee"
          render={(employee, record) => {
            if (employee) {
              return (
                <span>{`${employee.firstName} ${employee.lastName}`}</span>
              );
            } else {
              return <span>Chưa có nhân viên</span>;
            }
          }}
        />

        <Column title="Ghi chú" dataIndex="description" key="description" />
        <Column
          title="Hành động"
          key="action"
          render={(record) => (
            <Space>
              <button
                className="w-full flex justify-between items-center text-black py-1 px-1 rounded-md border-2 border-black hover:bg-gray hover:text-black"
                onClick={() => {
                  setOpenOrderDetail(true);
                  setSelectedOrderId(record);
                }}
              >
                <EyeIcon className="mr-2" size={20} strokeWidth={1} />
                Xem
              </button>
              {record.status !== "CANCELED" && (
                <button
                  className="w-full flex justify-between items-center text-blue py-1 px-1 rounded-md border-2 border-blue hover:bg-gray hover:text-black"
                  onClick={() => {
                    setOpen(true);
                    setUpdateId(record._id);
                    updateForm.setFieldsValue(record);
                  }}
                >
                  <FilePenLine className="mr-2" size={20} strokeWidth={1} />
                  Sửa
                </button>
              )}
              {record.status !== "CANCELED" && (
                <Popconfirm
                  placement="top"
                  title={text}
                  disabled={record.status === "CANCELED"}
                  onConfirm={() => {
                    handleCancelOrder(record._id);
                  }}
                  okText="Có"
                  okButtonProps={{ className: "bg-black text-white" }}
                  cancelText="Không"
                >
                  <button className="w-full flex justify-between items-center text-red py-1 px-1 rounded-md border-2 border-red hover:bg-gray hover:text-black">
                    <CircleXIcon className="mr-2" size={20} strokeWidth={1} />
                    Hủy
                  </button>
                </Popconfirm>
              )}
            </Space>
          )}
        />
      </Table>
      <Modal
        open={open}
        title="Chỉnh Sửa Trạng Thái Đơn Hàng"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Hủy"
        okText="Cập nhật"
        okButtonProps={{ className: "bg-black text-white" }}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item label="Nhân viên" name="employeeId">
            <Select
              style={{ width: "80%" }}
              options={employees.map((c) => {
                return {
                  value: c._id,
                  label: c.lastName + " " + c.firstName,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <Select style={{ width: "80%" }}>
              <Select.Option value="WAITING">Đang đợi duyệt</Select.Option>
              <Select.Option value="COMPLETE">Đã mua</Select.Option>
              <Select.Option value="CANCELED">Đã hủy</Select.Option>
              <Select.Option value="APPROVED">Đã duyệt</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={1000}
        orderDetails={selectedOrderId}
        open={openOrderDetail}
        title="Chi Tiết Đơn Hàng"
        onCancel={() => {
          setOpenOrderDetail(false);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setOpenOrderDetail(false);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedOrderId?.orderDetails}
          rowKey="_id"
          scroll={{ x: true }}
        >
          <Column
            title="STT"
            render={(_text, _record, index) => {
              return <span>{index + 1}</span>;
            }}
          />
          <Table.Column
            title="Tên sản phẩm"
            dataIndex="productName"
            key="productName"
            render={(_text, record) => {
              return <span>{record.productName}</span>;
            }}
          />
          <Table.Column
            title="Ảnh"
            dataIndex="imageUrl"
            key="imageUrl"
            render={(_text, record) => (
              <img
                src={`${API_URL}${record.imageUrl}`}
                alt={`Avatar-${record._id}`}
                style={{ width: "auto", height: 100 }}
              />
            )}
          />
          <Table.Column
            title="Số lượng"
            dataIndex="quantity"
            key="quantity"
            render={(_text, record) => {
              return <span>{record.quantity}</span>;
            }}
          />
          <Table.Column
            title="Giá gốc"
            dataIndex="price"
            key="price"
            render={(_text, record) => {
              return <span>{numeral(record.price).format("0,0")}đ</span>;
            }}
          />
          <Table.Column
            title="Giảm giá (%)"
            dataIndex="discount"
            key="discount"
            render={(_text, record) => {
              return <span>{record.discount}%</span>;
            }}
          />
          <Table.Column
            title="Tổng tiền"
            key="total"
            render={(_text, record) => {
              const total =
                record.quantity * record.price * (1 - record.discount / 100);
              return (
                <span className="font-bold">
                  {numeral(total).format("0,0")}đ
                </span>
              );
            }}
          />
        </Table>
      </Modal>
    </div>
  );
}

export default memo(ManageOrder);
