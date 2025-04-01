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
import { getCurrentUSDCPrice } from "@/lib/api";

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

// Generate simulated historical price data
const generateHistoricalPrices = () => {
  const data = [];
  const now = new Date();
  
  // Generate data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Random price between 0.9985 and 1.0015
    // With higher probability of being close to 1.0
    const randomFactor = (Math.random() - 0.5) * 0.003;
    const price = 1.0 + randomFactor;
    
    data.push({
      date: date.toISOString().slice(0, 10),
      price: price
    });
  }
  
  return data;
};

export default function PegStabilityGauge() {
  const [price, setPrice] = useState<number>(1.0);
  const [historicalPrices, setHistoricalPrices] = useState<{date: string, price: number}[]>([]);
  
  useEffect(() => {
    // Get current price
    const currentPrice = getCurrentUSDCPrice();
    setPrice(currentPrice);
    
    // Generate historical data
    const priceHistory = generateHistoricalPrices();
    // Replace the last price with our current price
    priceHistory[priceHistory.length - 1].price = currentPrice;
    setHistoricalPrices(priceHistory);
  }, []);

  // Calculate deviation from peg (1.0)
  const deviation = Math.abs(price - 1.0);
  const deviationPercentage = deviation * 100;
  
  // Determine status color based on deviation
  let statusColor = "#4caf50"; // Green for good peg
  let statusText = "Stable";
  if (deviationPercentage > 0.1) {
    statusColor = "#ff9800"; // Orange for slight deviation
    statusText = "Minor Deviation";
  }
  if (deviationPercentage > 0.5) {
    statusColor = "#f44336"; // Red for significant deviation
    statusText = "Significant Deviation";
  }

  // Create line chart data
  const chartData = {
    labels: historicalPrices.map(d => d.date.slice(5)), // MM-DD format
    datasets: [
      {
        label: "USDC Price",
        data: historicalPrices.map(d => d.price),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
      },
      {
        label: "Target Peg",
        data: historicalPrices.map(() => 1.0),
        borderColor: "#9ca3af",
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
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
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              return `Price: $${context.raw.toFixed(4)}`;
            } else {
              return `Target: $1.0000`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        min: 0.9985,
        max: 1.0015,
        ticks: {
          callback: function(value: number) {
            return `$${value.toFixed(4)}`;
          },
        },
        grid: {
          color: (context: any) => {
            if (context.tick.value === 1) {
              return 'rgba(0, 0, 0, 0.2)';
            }
            return 'rgba(0, 0, 0, 0.05)';
          },
          lineWidth: (context: any) => {
            if (context.tick.value === 1) {
              return 2;
            }
            return 1;
          },
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Current price indicator */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center">
          <div className="text-2xl font-bold mr-2">${price.toFixed(4)}</div>
          <div 
            className="text-sm px-2 py-1 rounded-full font-medium"
            style={{ 
              backgroundColor: `${statusColor}20`, 
              color: statusColor 
            }}
          >
            {statusText}
          </div>
        </div>
        <div className="text-sm text-neutral-500">
          {price > 1.0 ? "+" : ""}{(price - 1.0).toFixed(4)} ({deviationPercentage.toFixed(2)}%)
        </div>
      </div>
      
      {/* Deviation range indicator */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-xs text-neutral-500">Acceptable Range:</div>
        <div className="flex items-center">
          <div className="text-xs font-medium text-neutral-600">$0.9995</div>
          <div className="mx-2 h-0.5 w-10 bg-neutral-300"></div>
          <div className="text-xs font-medium text-neutral-600">$1.0000</div>
          <div className="mx-2 h-0.5 w-10 bg-neutral-300"></div>
          <div className="text-xs font-medium text-neutral-600">$1.0005</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-grow">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-2 text-xs text-neutral-500">
        <div className="flex items-center mr-4">
          <div className="w-3 h-1 bg-indigo-500 mr-1"></div>
          <span>USDC Price</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-1 border-t border-dashed border-neutral-400 mr-1"></div>
          <span>Target ($1.00)</span>
        </div>
      </div>
    </div>
  );
}
