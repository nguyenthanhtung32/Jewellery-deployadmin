import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axiosClient from "@/libraries/axiosClient";

const PieChart = () => {
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/orders/status");
        setStatusData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getStatusText = (status) => {
    if (status === "COMPLETE") {
      return "Đã mua";
    } else if (status === "WAITING") {
      return "Đang đợi duyệt";
    } else if (status === "CANCELED") {
      return "Đã hủy";
    } else status = "APPROVED";
    return "Đã duyệt";
  };

  const labels = Object.keys(statusData).map(getStatusText);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng đơn hàng",
        data: Object.values(statusData),
        backgroundColor: ["#36A2EB", "#FFCE56", "#000000", "#2020e0"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#000000", "#2020e0"],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default PieChart;
