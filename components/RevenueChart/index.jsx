import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const RevenueLineChart = ({ monthlyRevenue }) => {
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const labels = Object.keys(monthlyRevenue).map((month) => `Tháng ${month}`);
    const data = Object.values(monthlyRevenue);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Doanh thu",
            data: data,
            fill: false,
            borderColor: "#000000",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Tổng tiền",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyRevenue]);

  return <canvas ref={chartRef} />;
};

export default RevenueLineChart;
