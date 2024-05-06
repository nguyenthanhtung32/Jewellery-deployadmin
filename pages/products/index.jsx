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
  Popconfirm,
  Upload,
  Image,
} from "antd";
import {
  ArrowBigLeftDash,
  FilePenLine,
  PackagePlus,
  Trash2,
} from "lucide-react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { API_URL } from "@/constants";
import axiosClient from "@/libraries/axiosClient";
import numeral from "numeral";
import { useRouter } from "next/router";

const { Column } = Table;

const apiName = "/products";

function ManageProducts() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [showTable, setShowTable] = useState(true);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [openDetailPicture, setOpenDetailPicture] = useState(false);
  const [searchProductName, setSearchProductName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showStockInput, setShowStockInput] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      const [productResponse, categoryResponse, sizeResponse] =
        await Promise.all([
          axiosClient.get(apiName),
          axiosClient.get("/categories"),
          axiosClient.get("/sizes"),
        ]);
      setData(productResponse.data);
      setCategories(categoryResponse.data);
      setSizes(sizeResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    [refresh];
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const onFinish = async (values) => {
    try {
      const response = await axiosClient.post(apiName, values);
      const createdProductId = response.data.result._id;

      if (imageFile) {
        uploadImage(createdProductId);
      }

      fetchData();
    } catch (error) {
      console.error("Creating product:", error);
    }
  };

  const uploadImage = async (productId) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("filename", imageFile.name);

    try {
      await axiosClient.post(
        `${API_URL}/productImages/products/${productId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Thêm sản phẩm thành công");
      setShowTable(true);
      fetchData();
      router.reload();
    } catch (error) {
      console.error("Error uploading product image:", error);
    }
  };

  const onOpenModal = (record) => {
    setOpen(true);
    setUpdateId(record._id);
    updateForm.setFieldsValue(record);

    const categoryId = record.categoryId;

    const category = categories.find((cat) => cat._id === categoryId);
    if (category) {
      const hasSizeCategory =
        category._id === "65d72854f159c29036e3b592" ||
        category._id === "65d72873f159c29036e3b596" ||
        category._id === "65d7fe3ff886833fc01e7771";

      if (hasSizeCategory) {
        setShowSizeInput(true);
        setShowStockInput(false);
      } else {
        setShowSizeInput(false);
        setShowStockInput(true);
      }
    }
  };

  const handleCategoryChange = (value) => {
    const hasSizeCategory =
      value === "65d72854f159c29036e3b592" ||
      value === "65d72873f159c29036e3b596" ||
      value === "65d7fe3ff886833fc01e7771";

    if (hasSizeCategory) {
      setShowSizeInput(true);
      setShowStockInput(false);
    } else {
      setShowSizeInput(false);
      setShowStockInput(true);
    }
  };

  const onUpdateFinish = async (values) => {
    try {
      await axiosClient.patch(apiName + "/" + updateId, values);
      updateForm.resetFields();
      message.success("Cập nhật thành công", 1.5);
      setOpen(false);
      setRefresh((prevRefresh) => prevRefresh + 1);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const getSizeBySizeId = (productId) => {
    const product = data.find((item) => item._id === productId);
    if (product && product.sizeId) {
      const sizeObject = sizes.find((size) => size._id === product.sizeId);
      if (sizeObject && sizeObject.sizes.length > 0) {
        return sizeObject.sizes.map((item, index) => (
          <div key={index}>{item.size}</div>
        ));
      }
    }
    return "";
  };

  const getStockByStockId = (productId) => {
    const product = data.find((item) => item._id === productId);
    if (product && product.sizeId) {
      const sizeObject = sizes.find((size) => size._id === product.sizeId);
      if (sizeObject && sizeObject.sizes.length > 0) {
        return sizeObject.sizes.map((item, index) => (
          <div key={index}>{item.stock}</div>
        ));
      }
    }
    return "";
  };

  const text = "Bạn có muốn xóa sản phẩm?";

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
          <h1 className="text-center text-2xl pb-3">Thêm sản phẩm</h1>
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
              rules={[
                {
                  required: true,
                  message: "Hãy điền đầy đủ thông tin",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mã"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Hãy điền đầy đủ thông tin",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giá gốc"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Hãy điền đầy đủ thông tin",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giảm giá (%)"
              name="discount"
              rules={[{ required: true, message: "Hãy điền đầy đủ thông tin" }]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Danh mục"
              name="categoryId"
              hasFeedback
              required={true}
              rules={[
                {
                  required: true,
                  message: "Hãy điền đầy đủ thông tin",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                options={categories.map((c) => {
                  return { value: c._id, label: c.name };
                })}
                onChange={handleCategoryChange}
              />
            </Form.Item>
            {showStockInput && (
              <Form.Item
                label="Số lượng"
                name="stock"
                rules={[
                  { required: true, message: "Hãy điền đầy đủ thông tin" },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
            )}
            {showSizeInput && (
              <Form.Item
                label="Kích cỡ"
                name="sizeId"
                rules={[
                  {
                    required: true,
                    message: "Hãy điền đầy đủ thông tin",
                  },
                ]}
                hasFeedback
              >
                <Select
                  style={{ width: "100%" }}
                  options={sizes.map((c) => {
                    return { value: c._id, label: c.productName };
                  })}
                />
              </Form.Item>
            )}

            <Form.Item label="Ảnh sản phẩm" name="img">
              <Upload
                maxCount={1}
                listType="picture-card"
                showUploadList={true}
                beforeUpload={(img) => {
                  setImageFile(img);
                  return false;
                }}
                onRemove={() => {
                  setImageFile(null);
                }}
                onChange={(info) => handleImageChange(info.file)}
              >
                {!imageFile ? (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : (
                  ""
                )}
              </Upload>
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
        <>
          <div>
            <h1 className="text-2xl text-center mt-3">Danh Sách Sản Phẩm</h1>
            <div className="flex items-center justify-between px-2 pb-3">
              <div className="flex items-center w-3/6">
                <Input.Search
                  placeholder="Tìm kiếm sản phẩm"
                  className="w-auto bg-black rounded-lg h-3/4"
                  allowClear
                  enterButton
                  value={searchProductName}
                  onChange={(e) => setSearchProductName(e.target.value)}
                  onSearch={(value) => {
                    setFilteredInfo({ productName: [value] });
                  }}
                />
                <Select
                  className="w-2/6 ml-3  h-3/4"
                  mode="multiple"
                  placeholder="Chọn danh mục"
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                >
                  {categories.map((category) => (
                    <Select.Option key={category._id} value={category.name}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <button
                className="flex justify-end items-center py-1 px-1 mb-2 rounded-md border-2 border-black hover:bg-black hover:text-white"
                onClick={() => {
                  setShowTable(false);
                }}
              >
                <PackagePlus size={25} strokeWidth={1} />
                <span>Thêm sản phẩm</span>
              </button>
            </div>

            <Table dataSource={data} rowKey="_id" scroll={{ x: true }}>
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
                filteredValue={filteredInfo.productName || null}
                onFilter={(value, record) =>
                  record.productName.toLowerCase().includes(value.toLowerCase())
                }
              />
              <Column title="Mã" dataIndex="code" key="code" />
              <Column
                title="Giá gốc"
                sorter={(a, b) => a.price - b.price}
                dataIndex="price"
                key="price"
                render={(text) => {
                  return <span>{numeral(text).format("0,0")}đ</span>;
                }}
              />
              <Column
                title="Giảm giá (%)"
                sorter={(a, b) => a.discount - b.discount}
                dataIndex="discount"
                key="discount"
              />
              <Column
                title="Kích cỡ"
                dataIndex="_id"
                key="sizes"
                render={(sizeId) => <span>{getSizeBySizeId(sizeId)}</span>}
              />
              <Column
                title="Số lượng"
                dataIndex="_id"
                key="stock"
                render={(text, record) => {
                  const stockId = record._id;
                  const stockQuantity = record.stock;
                  if (stockQuantity) {
                    return <span>{stockQuantity}</span>;
                  } else {
                    return <span>{getStockByStockId(stockId)}</span>;
                  }
                }}
              />
              <Column
                title="Danh mục"
                dataIndex="category.name"
                key="category.name"
                filteredValue={selectedCategories}
                onFilter={(value, record) =>
                  record.category.name.includes(value)
                }
                render={(_text, record) => {
                  return <span>{record.category.name}</span>;
                }}
              />
              <Column
                title="Ảnh"
                dataIndex="imageUrl"
                key="imageUrl"
                render={(imageUrl, record) => (
                  <img
                    src={`${API_URL}/${imageUrl}`}
                    className="w-auto, h-[125px] cursor-pointer"
                    onClick={() => {
                      setUpdateId(record);
                      setOpenDetailPicture(true);
                    }}
                    alt={`Image-${record._id}`}
                    style={{ width: "auto", height: 100 }}
                  />
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
                        onOpenModal(record);
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
              cancelText="Hủy"
              okText="Cập nhật"
              okButtonProps={{
                style: {
                  color: "white",
                  background: "black",
                },
              }}
              onOk={() => updateForm.submit()}
              title="Chỉnh Sửa Thông Tin Sản Phẩm"
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
                <Form.Item label="Tên sản phẩm" name="productName">
                  <Input />
                </Form.Item>
                <Form.Item label="Mã" name="code">
                  <Input />
                </Form.Item>
                <Form.Item label="Giá gốc" name="price">
                  <Input />
                </Form.Item>
                <Form.Item label="Giảm giá (%)" name="discount">
                  <Input />
                </Form.Item>
                <Form.Item label="Danh mục" name="categoryId">
                  <Select
                    style={{ width: "100%" }}
                    options={categories.map((c) => {
                      return { value: c._id, label: c.name };
                    })}
                  />
                </Form.Item>
                {showSizeInput && (
                  <Form.Item label="Kích cỡ" name="sizeId" hidden>
                    <Select
                      style={{ width: "100%" }}
                      options={sizes.map((c) => {
                        return { value: c._id, label: c.productName };
                      })}
                    />
                  </Form.Item>
                )}
                {showStockInput && (
                  <Form.Item label="Số lượng" name="stock">
                    <Input />
                  </Form.Item>
                )}
              </Form>
            </Modal>
            <Modal
              open={openDetailPicture}
              onCancel={() => setOpenDetailPicture(false)}
              onOk={() => setOpenDetailPicture(false)}
              okType="default"
              okText="Cập nhật"
              okButtonProps={{
                style: {
                  color: "white",
                  background: "black",
                },
              }}
              cancelText="Hủy"
            >
              {updateId && (
                <div className="text-center">
                  <div className="text-center  py-2 ">
                    {updateId && updateId?.name}
                  </div>
                  <div className="text-center font-bold  py-2 ">
                    Ảnh Sản Phẩm
                  </div>
                  <div className="d-flex justify-content-center mb-5">
                    <Image
                      width={200}
                      height={200}
                      src={`${API_URL}${updateId?.imageUrl}`}
                    />
                  </div>
                  <Upload
                    showUploadList={false}
                    name="file"
                    action={`${API_URL}/productImages/products/${updateId?._id}/image`}
                    headers={{ authorization: "authorization-text" }}
                    onChange={(info) => {
                      if (info.file.status === "done") {
                        router.reload();
                        message.success("Cập nhật ảnh sản phẩm thành công!");
                      } else if (info.file.status === "error") {
                        message.error("Cập nhật ảnh sản phẩm thất bại.");
                      }
                    }}
                  >
                    <Button icon={<EditOutlined />} />
                  </Upload>
                </div>
              )}
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(ManageProducts);
