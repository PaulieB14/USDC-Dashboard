"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { useUSDC } from "@/lib/context/usdc-context";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

// Network colors
const NETWORK_COLORS = {
  ethereum: "rgba(52, 152, 219, 0.8)",
  polygon: "rgba(155, 89, 182, 0.8)",
  arbitrum: "rgba(0, 188, 212, 0.8)",
  optimism: "rgba(231, 76, 60, 0.8)",
  base: "rgba(41, 128, 185, 0.8)",
};

export default function NetworkDistributionChart() {
  const { networkMetrics, isLoading } = useUSDC();

  // Process data for the chart
  const chartData = {
    labels: networkMetrics.map((metric) => {
      // Capitalize first letter of network name
      const networkName = metric.network.charAt(0).toUpperCase() + metric.network.slice(1);
      return networkName;
    }),
    datasets: [
      {
        data: networkMetrics.map((metric) => metric.totalSupply / 1_000_000_000), // Convert to billions
        backgroundColor: networkMetrics.map((metric) => NETWORK_COLORS[metric.network as keyof typeof NETWORK_COLORS]),
        borderColor: networkMetrics.map((metric) => NETWORK_COLORS[metric.network as keyof typeof NETWORK_COLORS].replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `$${value.toFixed(2)}B (${percentage}%)`;
          },
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
      ) : networkMetrics.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
