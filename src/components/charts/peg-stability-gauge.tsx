"use client";

import { useEffect, useRef } from "react";
import { useUSDC } from "@/lib/context/usdc-context";

export default function PegStabilityGauge() {
  const { currentPrice, isLoading } = useUSDC();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate deviation from peg (1.0)
  const deviation = Math.abs(currentPrice - 1.0);
  const deviationPercentage = deviation * 100;
  
  // Determine status based on deviation
  let status = "Stable";
  let statusColor = "text-green-600";
  
  if (deviationPercentage > 0.5) {
    status = "Unstable";
    statusColor = "text-red-600";
  } else if (deviationPercentage > 0.1) {
    status = "Slight Deviation";
    statusColor = "text-amber-500";
  }

  // Draw gauge on canvas
  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.8; // Position center near bottom
    const radius = Math.min(width, height) * 0.7;

    // Draw gauge background
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    // Draw gauge track
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#e5e7eb"; // Light gray
    ctx.stroke();

    // Calculate needle position based on price
    // Map price from 0.95-1.05 to startAngle-endAngle
    const minPrice = 0.95;
    const maxPrice = 1.05;
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice));
    const needleAngle = startAngle + ((clampedPrice - minPrice) / (maxPrice - minPrice)) * Math.PI;

    // Draw colored segments
    // Red zone (0.95-0.99)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + Math.PI * 0.4);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(239, 68, 68, 0.7)"; // Red
    ctx.stroke();

    // Yellow zone (0.99-0.995 and 1.005-1.01)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + Math.PI * 0.4, startAngle + Math.PI * 0.45);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"; // Amber
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + Math.PI * 0.55, startAngle + Math.PI * 0.6);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"; // Amber
    ctx.stroke();

    // Green zone (0.995-1.005)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + Math.PI * 0.45, startAngle + Math.PI * 0.55);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"; // Green
    ctx.stroke();

    // Yellow zone (1.005-1.01)
    // Already drawn above

    // Red zone (1.01-1.05)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + Math.PI * 0.6, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(239, 68, 68, 0.7)"; // Red
    ctx.stroke();

    // Draw needle
    const needleLength = radius * 0.8;
    const needleWidth = 4;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(needleAngle);

    // Needle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(needleLength, 0);
    ctx.lineWidth = needleWidth;
    ctx.strokeStyle = "#1f2937"; // Dark gray
    ctx.stroke();

    // Needle center
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#1f2937";
    ctx.fill();

    ctx.restore();

    // Draw labels
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    
    // Min label
    ctx.fillText("$0.95", centerX - radius * 0.8, centerY + 30);
    
    // Center label
    ctx.fillText("$1.00", centerX, centerY - radius * 0.2);
    
    // Max label
    ctx.fillText("$1.05", centerX + radius * 0.8, centerY + 30);

  }, [currentPrice, isLoading]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold">${currentPrice.toFixed(4)}</div>
            <div className={`text-sm font-medium ${statusColor}`}>{status}</div>
            <div className="text-xs text-neutral-500 mt-1">
              {deviationPercentage.toFixed(2)}% deviation from peg
            </div>
          </div>
          
          <div className="w-full h-64 relative">
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={200} 
              className="w-full h-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
