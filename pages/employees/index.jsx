import React, { memo, useState, useEffect } from "react";
import {
  Table,
  message,
  Form,
  Modal,
  Input,
  Select,
  Space,
  Button,
  Radio,
  DatePicker,
} from "antd";
import {
  ArrowBigLeftDash,
  FilePenLine,
  LockIcon,
  UnlockIcon,
  UserRoundPlus,
} from "lucide-react";
import axiosClient from "@/libraries/axiosClient";
import Moment from "moment";
const { Column } = Table;

const apiName = "/employees";

function ManageEmployees() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [showTable, setShowTable] = useState(true);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  const fetchProvinces = () => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchDistricts = (provinceId) => {
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchWards = (districtId) => {
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        setWards(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleProvinceChange = (value) => {
    fetchDistricts(value);
    setWards([]);
  };

  const handleDistrictChange = (value) => {
    fetchWards(value);
  };

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

  const onFinish = (values) => {
    const { provinceId, districtId, wardId, address } = values;

    const provinceName = provinces.find(
      (province) => province.province_id === provinceId
    )?.province_name;
    const districtName = districts.find(
      (district) => district.district_id === districtId
    )?.district_name;
    const wardName = wards.find((ward) => ward.ward_id === wardId)?.ward_name;

    if (provinceName && districtName && wardName) {
      const fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}  `;

      const dataToSend = { ...values, address: fullAddress };

      axiosClient
        .post(apiName, dataToSend)
        .then((_response) => {
          setRefresh((f) => f + 1);
          createForm.resetFields();
          message.success("Thêm mới thành công", 1.5);
          setShowTable(true);
        })
        .catch((err) => {
          console.error(err);
          message.error("Thêm mới thất bại");
        });
    } else {
      toast.error("Đã xảy ra lỗi khi tạo địa chỉ hoàn chỉnh.");
    }
    [refresh];
  };

  const lockEmployees = (employeesId) => {
    axiosClient
      .post(apiName + `/${employeesId}/lock`)
      .then(() => {
        setRefresh((f) => f + 1);
        message.success("Khóa thành công!", 1.5);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const unlockEmployees = (employeesId) => {
    axiosClient
      .post(apiName + `/${employeesId}/unlock`)
      .then(() => {
        setRefresh((f) => f + 1);
        message.success("Mở khóa thành công!", 1.5);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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

  const checkUserRole = (role) => {
    return role !== "Admin";
  };

  return (
    <div>
      {showTable === false ? (
        <>
          <div style={{ textAlign: "left" }}>
            <button
              className="mt-3 ml-3"
              onClick={() => {
                setShowTable(true);
              }}
            >
              <ArrowBigLeftDash size={25} strokeWidth={1} />
            </button>
          </div>
          <h1 className="text-center text-2xl pb-3">Thêm Nhân Viên</h1>
          {/* CREATE FORM */}
          <Form
            className="w-4/5"
            form={createForm}
            name="create-form"
            onFinish={onFinish}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item
              label="Họ"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              hasFeedback
            >
              <DatePicker
                placeholder="yyyy-mm-dd"
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              hasFeedback
            >
              <Space>
                <Radio.Group>
                  <Radio value="Nam">Nam</Radio>
                  <Radio value="Nữ">Nữ</Radio>
                  <Radio value="LGBT">LGBT</Radio>
                </Radio.Group>
              </Space>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
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
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu xác nhận không khớp");
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
                {
                  pattern: /^(0\d{9,10})$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item label="Địa chỉ" rules={[{ required: true }]} hasFeedback>
              <div className="xl:space-x-3 lg:block xl:flex">
                <Form.Item
                  name="provinceId"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
                  ]}
                  hasFeedback
                >
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    size="large"
                    options={
                      provinces.length > 0 &&
                      provinces.map((province) => {
                        return {
                          value: province.province_id,
                          label: province.province_name,
                        };
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="districtId"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng chọn Quận/Huyện" },
                  ]}
                  hasFeedback
                >
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={handleDistrictChange}
                    size="large"
                    options={
                      districts.length > 0 &&
                      districts.map((district) => {
                        return {
                          value: district.district_id,
                          label: district.district_name,
                        };
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="wardId"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng chọn Phường/Xã" },
                  ]}
                  hasFeedback
                >
                  <Select
                    placeholder="Chọn Phường/Xã"
                    size="large"
                    options={
                      wards.length > 0 &&
                      wards.map((ward) => {
                        return {
                          value: ward.ward_id,
                          label: ward.ward_name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="address"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
                ]}
                hasFeedback
              >
                <Input size="large" placeholder="Nhập địa chỉ cụ thể" />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Chức vụ"
              name="role"
              initialValue="Nhân viên"
              hidden
            >
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button htmlType="submit" className="bg-black text-white">
                Thêm Mới
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <div>
          <h1 className="text-2xl text-center mt-3">Danh Sách Nhân Viên</h1>
          <div className="flex justify-end pr-2">
            <button
              className="flex items-center py-1 px-1 mb-2 rounded-md border-2 border-black hover:bg-black hover:text-white"
              onClick={() => {
                setShowTable(false);
              }}
            >
              <UserRoundPlus size={25} strokeWidth={1} />
              <span>Thêm Nhân Viên</span>
            </button>
          </div>
          <Table dataSource={data} rowKey="_id" scroll={{ x: true }}>
            <Column
              title="STT"
              render={(_text, _record, index) => {
                return <span>{index + 1}</span>;
              }}
            />
            <Column title="Họ" dataIndex="lastName" key="lastName" />
            <Column title="Tên" dataIndex="firstName" key="firstName" />
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
            <Column title="Chức vụ" dataIndex="role" key="role" />
            <Column
              title="Trạng thái"
              dataIndex="isLocked"
              key="isLocked"
              render={(isLocked) => (
                <span>
                  {isLocked ? (
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
                  {checkUserRole(record.role) && !record.isLocked && (
                    <button
                      className="w-full flex justify-between items-center text-black py-1 px-1 rounded-md border-2 border-black hover:bg-gray hover:text-black"
                      onClick={() => lockEmployees(record._id)}
                    >
                      <LockIcon className="mr-2" size={20} strokeWidth={1} />
                      Khóa
                    </button>
                  )}
                  {checkUserRole(record.role) && record.isLocked && (
                    <button
                      className="w-full flex justify-between items-center text-black py-1 px-1 rounded-md border-2 border-black hover:bg-gray hover:text-black"
                      onClick={() => unlockEmployees(record._id)}
                    >
                      <UnlockIcon className="mr-2" size={20} strokeWidth={1} />
                      Mở
                    </button>
                  )}
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
                </Space>
              )}
            />
          </Table>
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            cancelText="Hủy"
            okText="Cập nhật"
            okButtonProps={{
              style: {
                color: "white",
                background: "black",
              },
            }}
            onOk={() => updateForm.submit()}
            title="Chỉnh Sửa Thông Tin Nhân Viên"
            className="text-center"
          >
            <p style={{ textAlign: "center", color: "#888" }}>
              Lưu ý: Chỉ có thể chỉnh sửa các thông tin trong khung
            </p>
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
              <Form.Item label="Họ" name="firstName">
                <Input className="pointer-events-none" bordered={false} />
              </Form.Item>
              <Form.Item label="Tên" name="lastName">
                <Input className="pointer-events-none" bordered={false} />
              </Form.Item>
              <Form.Item label="Ngày sinh" name="birthday">
                <Input className="pointer-events-none" bordered={false}  />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender">
                <Select className="text-start">
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="LGBT">LGBT</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input className="pointer-events-none" bordered={false} />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input className="pointer-events-none" bordered={false} />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="Chức vụ" name="role">
                <Select className="text-start">
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Nhân viên">Nhân viên</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default memo(ManageEmployees);
