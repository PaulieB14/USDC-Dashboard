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
  Filler,
} from "chart.js";
import { simulateHistoricalUSDCSupply } from "@/lib/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TotalSupplyChart() {
  const [data, setData] = useState<{ date: string; supply: number }[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const supplyData = simulateHistoricalUSDCSupply();
    setData(supplyData);
  }, []);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Total USDC Supply",
        data: data.map((d) => d.supply / 1_000_000_000), // Convert to billions
        borderColor: "rgb(46, 125, 50)",
        backgroundColor: "rgba(46, 125, 50, 0.1)",
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
            return `$${tooltipItem.raw.toFixed(2)}B`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Billions of USDC",
        },
        ticks: {
          callback: function (value: number) {
            return `$${value}B`;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
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
