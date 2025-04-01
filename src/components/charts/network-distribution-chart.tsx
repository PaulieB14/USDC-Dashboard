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

  // Debug logging
  console.log("Network metrics in chart:", networkMetrics);
  
  // Log the total supply for each network
  networkMetrics.forEach((metric) => {
    console.log(`${metric.network} total supply: ${metric.totalSupply}`);
  });

  // Process data for the chart
  // Use logarithmic scale to better visualize the data
  const chartData = {
    labels: networkMetrics.map((metric) => {
      // Capitalize first letter of network name
      const networkName = metric.network.charAt(0).toUpperCase() + metric.network.slice(1);
      return networkName;
    }),
    datasets: [
      {
        // Use logarithm of values for better visualization
        // Add 1 to avoid log(0) and take log base 10
        data: networkMetrics.map((metric) => Math.log10(metric.totalSupply + 1)),
        backgroundColor: networkMetrics.map((metric) => NETWORK_COLORS[metric.network as keyof typeof NETWORK_COLORS]),
        borderColor: networkMetrics.map((metric) => NETWORK_COLORS[metric.network as keyof typeof NETWORK_COLORS].replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };
  
  // Debug logging for chart data
  console.log("Chart data:", chartData);

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
            // Get the value directly
            const index = context.dataIndex;
            const value = networkMetrics[index].totalSupply;
            
            // Format the value based on its size
            let formattedValue;
            if (value >= 1_000_000_000) {
              formattedValue = `$${(value / 1_000_000_000).toFixed(2)}B`; // Show as billions
            } else if (value >= 1_000_000) {
              formattedValue = `$${(value / 1_000_000).toFixed(2)}M`; // Show as millions
            } else {
              formattedValue = `$${value.toFixed(2)}`; // Show as dollars
            }
            
            // Calculate percentage based on the total
            const total = networkMetrics.reduce((sum, metric) => sum + metric.totalSupply, 0);
            const percentage = Math.round((value / total) * 100);
            
            return `${formattedValue} (${percentage}%)`;
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
