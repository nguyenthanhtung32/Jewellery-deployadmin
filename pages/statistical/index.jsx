import React, { useState, useEffect } from "react";
import RevenueLineChart from "@/components/RevenueChart";
import axiosClient from "@/libraries/axiosClient";
import PieChart from "@/components/PieChart";
import { Select } from "antd";

const apiName = "/orders";

function Statistical() {
  const [monthlyRevenue, setMonthlyRevenue] = useState({});
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    axiosClient
      .get(`${apiName}/revenue`)
      .then((response) => {
        setMonthlyRevenue(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div>
      <div className="container my-5 overflow-x-auto">
        <div className="flex items-center mb-5">
          <h1 className="mr-3">Chọn năm:</h1>
          <Select value={selectedYear} onChange={handleYearChange}>
            {Object.keys(monthlyRevenue).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-between">
          <div className="w-full">
            {selectedYear && monthlyRevenue[selectedYear] && (
              <div>
                <h1 className="flex justify-center font-bold mb-3">
                  Biểu đồ doanh thu các tháng trong năm {selectedYear}
                </h1>
                <RevenueLineChart
                  monthlyRevenue={monthlyRevenue[selectedYear]}
                />
              </div>
            )}
          </div>
          <div>
            <h1 className="flex justify-center font-bold mb-3">
              Biểu đồ thống kê theo trạng thái
            </h1>
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
