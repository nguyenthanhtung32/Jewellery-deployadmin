import React, { memo, useState, useEffect } from "react";
import {
  Table,
  message,
  Form,
  Modal,
  Input,
  Space,
  Button,
  Popconfirm,
} from "antd";
import {
  ArrowBigLeftDash,
  PackagePlus,
  FilePenLine,
  Trash2,
} from "lucide-react";
import axiosClient from "@/libraries/axiosClient";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Column } = Table;

const apiName = "/sizes";

function ManageStock() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [showTable, setShowTable] = useState(true);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
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

  const onFinish = (values) => {
    axiosClient
      .post(apiName, values)
      .then((_response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới thành công", 1.5);
        setShowTable(true);
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

  const text = "Xác nhận xóa ?";

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
          <h1 className="text-center text-2xl pb-3">Thêm Size & Số lượng</h1>
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
              label="Tên sản phẩm"
              name="productName"
              rules={[{ required: true, message: "Bắt buộc nhập" }]}
            >
              <Input />
            </Form.Item>
            <Form.List name="sizes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} align="baseline" className="mx-64">
                      <Form.Item
                        {...restField}
                        name={[name, "size"]}
                        fieldKey={[fieldKey, "size"]}
                        label="Size"
                        rules={[{ required: true, message: "Bắt buộc nhập" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        fieldKey={[fieldKey, "stock"]}
                        label="Số lượng"
                        rules={[{ required: true, message: "Bắt buộc nhập" }]}
                      >
                        <Input />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="mx-72"
                    >
                      Thêm Size & Số lượng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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
        <>
          <h1 className="text-2xl text-center mt-3">
            Danh Sách Size & Số Lượng
          </h1>
          <div className="flex justify-end pr-2">
            <button
              className="flex items-center py-1 px-1 mb-2 rounded-md border-2 border-black hover:bg-black hover:text-white"
              onClick={() => {
                setShowTable(false);
              }}
            >
              <PackagePlus size={25} strokeWidth={1} />
              <span>Thêm Size & Số lượng</span>
            </button>
          </div>
          <Table
            dataSource={data}
            rowKey="_id"
            className="flex justify-center"
            scroll={{ x: true }}
          >
            <Column
              title="STT"
              render={(_text, _record, index) => {
                return <span>{index + 1}</span>;
              }}
            />
            <Column
              title="Tên sản phẩm"
              dataIndex="productName"
              key="productName"
              className="font-bold"
            />
            <Column
              title="Size & Số lượng"
              dataIndex="sizes"
              key="sizes"
              render={(sizes) => (
                <div>
                  {sizes.map((item) => (
                    <div key={item._id}>
                      <span>Size: {item.size}</span>
                      <span> Số lượng: {item.stock}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Column
              title="Hành động"
              key="action"
              render={(record) => (
                <Space size="middle">
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

                  <Popconfirm
                    placement="top"
                    title={text}
                    onConfirm={() => {
                      axiosClient
                        .delete(apiName + "/" + record._id)
                        .then(() => {
                          setRefresh((f) => f + 1);
                          message.success("Xóa thành công", 1.5);
                        });
                    }}
                    okText="Có"
                    okButtonProps={{ className: "bg-black text-white" }}
                    cancelText="Không"
                  >
                    <button className="w-full flex justify-between items-center text-red py-1 px-1 rounded-md border-2 border-red hover:bg-gray hover:text-black">
                      <Trash2 className="mr-2" size={20} strokeWidth={1} />
                      Xóa
                    </button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            okText="Cập nhật"
            okButtonProps={{
              style: {
                color: "white",
                background: "black",
              },
            }}
            onOk={() => updateForm.submit()}
            title="Sửa Size & Số lượng"
            className="text-center"
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
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[{ required: true, message: "Bắt buộc nhập" }]}
              >
                <Input />
              </Form.Item>
              <Form.List name="sizes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, "size"]}
                          fieldKey={[fieldKey, "size"]}
                          label="Size"
                          rules={[{ required: true, message: "Bắt buộc nhập" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "stock"]}
                          fieldKey={[fieldKey, "stock"]}
                          label="Số lượng"
                          rules={[{ required: true, message: "Bắt buộc nhập" }]}
                        >
                          <Input />
                        </Form.Item>
                        <DeleteOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        className="mx-20"
                      >
                        Thêm Size & Số lượng
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}

export default memo(ManageStock);
