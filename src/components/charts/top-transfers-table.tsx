"use client";

import { useUSDC } from "@/lib/context/usdc-context";

function formatAddress(address: string | undefined): string {
  if (!address) return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAmount(amount: string | undefined): string {
  if (!amount) return '$0.00';
  const value = parseFloat(amount);
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(timestamp: string | undefined): string {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function getExplorerUrl(network: string, hash: string | undefined, type: 'tx' | 'address'): string {
  if (!hash) return '#';
  
  const explorers: { [key: string]: string } = {
    ethereum: 'https://etherscan.io',
    polygon: 'https://polygonscan.com',
    arbitrum: 'https://arbiscan.io',
    optimism: 'https://optimistic.etherscan.io',
    base: 'https://basescan.org',
  };
  
  const baseUrl = explorers[network] || explorers.ethereum;
  return `${baseUrl}/${type}/${hash}`;
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
              <th className="text-right py-2">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {largeTransfers.map((transfer, index) => (
              <tr key={index} className="border-b hover:bg-neutral-50">
                <td className="py-2 font-mono text-xs">
                  <a
                    href={getExplorerUrl(transfer.network, transfer.from, 'address')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatAddress(transfer.from)}
                  </a>
                </td>
                <td className="py-2 font-mono text-xs">
                  <a
                    href={getExplorerUrl(transfer.network, transfer.to, 'address')}
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
                <td className="text-right py-2 font-mono text-xs">
                  <a
                    href={getExplorerUrl(transfer.network, transfer.transaction_hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatAddress(transfer.transaction_hash)}
                  </a>
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
