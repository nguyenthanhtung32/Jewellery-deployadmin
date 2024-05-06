import React, { memo, useState, useEffect } from "react";
import { Table, Rate } from "antd";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";
import Moment from "moment";
const { Column } = Table;

const apiName = "/reviews";

function ManageReview() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    axiosClient
      .get("/customers")
      .then((response) => {
        const { data } = response;
        setCustomers(data);
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

  return (
    <div>
      <h1 className="text-2xl text-center my-3">Danh Sách Đánh Giá</h1>
      <Table dataSource={data} rowKey="_id" scroll={{ x: true }}>
        <Column
          title="Khách hàng"
          dataIndex="customer"
          key="customer"
          render={(_text, record) => {
            return (
              <span className="font-semibold">{`${record.customer.firstName} ${record.customer.lastName}`}</span>
            );
          }}
        />
        <Column
          title="Sản phẩm"
          dataIndex="productName"
          key="productName"
          render={(_text, record) => {
            return <span>{record.product.productName}</span>;
          }}
        />
        <Column
          title="Hình ảnh"
          dataIndex="product.imageUrl"
          key="product.imageUrl"
          render={(_text, record) => (
            <img
              src={`${API_URL}/${record.product.imageUrl}`}
              alt={`Ảnh-${record.product._id}`}
              style={{ width: 100, height: 100 }}
            />
          )}
        />
        <Column
          title="Đánh giá"
          dataIndex="ratingRate"
          key="ratingRate"
          render={(ratingRate) => (
            <Rate
              className="flex"
              allowHalf
              disabled
              defaultValue={ratingRate}
            />
          )}
        />
        <Column title="Bình luận" dataIndex="comment" key="comment" />
        <Column
          title="Ngày đánh giá"
          dataIndex="reviewDate"
          key="reviewDate"
          render={(text) => {
            return <span>{Moment(text).format("DD/MM/YYYY")}</span>;
          }}
        />
      </Table>
    </div>
  );
}

export default memo(ManageReview);
