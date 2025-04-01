"use client";

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
import { useUSDC } from "@/lib/context/usdc-context";

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
  const { mintBurnData, isLoading } = useUSDC();

  const chartData = {
    labels: mintBurnData.map((d) => d.date),
    datasets: [
      {
        label: "Minted",
        data: mintBurnData.map((d) => d.minted / 1_000_000), // Convert to millions
        backgroundColor: "rgba(46, 125, 50, 0.8)",
        borderColor: "rgb(46, 125, 50)",
        borderWidth: 1,
      },
      {
        label: "Burned",
        data: mintBurnData.map((d) => d.burned / 1_000_000), // Convert to millions
        backgroundColor: "rgba(211, 47, 47, 0.8)",
        borderColor: "rgb(211, 47, 47)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toFixed(1)}M`;
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
          callback: function(value: any) {
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
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading data...</p>
        </div>
      ) : mintBurnData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
