"use client";

import { useUSDC } from "@/lib/context/usdc-context";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAmount(amount: string): string {
  const value = parseFloat(amount) / 1_000_000; // Convert from USDC units to millions
  return `$${value.toFixed(2)}M`;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export default function TopTransfersTable() {
  const { largeTransfers, isLoading } = useUSDC();

  return (
    <div className="w-full overflow-x-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <p>Loading data...</p>
        </div>
      ) : largeTransfers.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">From</th>
              <th className="text-left py-2">To</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-right py-2">Network</th>
              <th className="text-right py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {largeTransfers.map((transfer, index) => (
              <tr key={index} className="border-b hover:bg-neutral-50">
                <td className="py-2 font-mono text-xs">
                  <a
                    href={`https://etherscan.io/address/${transfer.from}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatAddress(transfer.from)}
                  </a>
                </td>
                <td className="py-2 font-mono text-xs">
                  <a
                    href={`https://etherscan.io/address/${transfer.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatAddress(transfer.to)}
                  </a>
                </td>
                <td className="text-right py-2 font-medium">
                  {formatAmount(transfer.amount)}
                </td>
                <td className="text-right py-2">
                  <span className="capitalize">{transfer.network}</span>
                </td>
                <td className="text-right py-2 text-neutral-600">
                  {formatDate(transfer.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p>No transfer data available</p>
        </div>
      )}
    </div>
  );
}
