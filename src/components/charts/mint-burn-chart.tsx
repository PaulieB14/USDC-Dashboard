"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { simulateMintBurnData } from "@/lib/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MintBurnChart() {
  const [data, setData] = useState<{ date: string; minted: number; burned: number }[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const mintBurnData = simulateMintBurnData();
    setData(mintBurnData);
  }, []);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Minted",
        data: data.map((d) => d.minted / 1_000_000), // Convert to millions
        backgroundColor: "rgba(46, 125, 50, 0.8)",
        borderColor: "rgb(46, 125, 50)",
        borderWidth: 1,
      },
      {
        label: "Burned",
        data: data.map((d) => d.burned / 1_000_000), // Convert to millions
        backgroundColor: "rgba(211, 47, 47, 0.8)",
        borderColor: "rgb(211, 47, 47)",
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(1)}M`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Millions of USDC",
        },
        ticks: {
          callback: function (value: number) {
            return `$${value}M`;
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
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading data...</p>
        </div>
      )}
    </div>
  );
}
