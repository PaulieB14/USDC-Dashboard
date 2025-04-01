"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { simulateWalletCountData } from "@/lib/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WalletCountChart() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const walletData = simulateWalletCountData();
    setData(walletData);
  }, []);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Unique Wallets",
        data: data.map((d) => d.count),
        borderColor: "rgb(25, 118, 210)",
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.raw.toLocaleString()} wallets`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Number of Wallets",
        },
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      {data.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading data...</p>
        </div>
      )}
    </div>
  );
}
