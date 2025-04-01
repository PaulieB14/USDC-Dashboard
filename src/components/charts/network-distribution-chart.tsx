"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Network data (simulated)
const networkData = [
  { network: "Ethereum", value: 18500000000, color: "rgba(98, 126, 234, 0.8)", borderColor: "#627EEA" },
  { network: "Polygon", value: 5200000000, color: "rgba(130, 71, 229, 0.8)", borderColor: "#8247E5" },
  { network: "Arbitrum", value: 3100000000, color: "rgba(40, 160, 240, 0.8)", borderColor: "#28A0F0" },
  { network: "Optimism", value: 2400000000, color: "rgba(255, 4, 32, 0.8)", borderColor: "#FF0420" },
  { network: "Base", value: 1000000000, color: "rgba(0, 82, 255, 0.8)", borderColor: "#0052FF" },
];

export default function NetworkDistributionChart() {
  const chartData = {
    labels: networkData.map(item => item.network),
    datasets: [
      {
        data: networkData.map(item => item.value / 1_000_000_000), // Convert to billions
        backgroundColor: networkData.map(item => item.color),
        borderColor: networkData.map(item => item.borderColor),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${tooltipItem.label}: $${value.toFixed(1)}B (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ height: "90%", width: "90%" }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
