"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { simulateLargeTransfers, TokenTransfer } from "@/lib/api";

export default function TopTransfersTable() {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const transferData = simulateLargeTransfers();
    setTransfers(transferData);
  }, []);

  // Format address for display (truncate middle)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format amount with commas and decimals
  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
    });
  };

  // Get block explorer URL for transaction
  const getExplorerUrl = (hash: string, network: string = 'ethereum') => {
    const explorers = {
      ethereum: 'https://etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      arbitrum: 'https://arbiscan.io/tx/',
      optimism: 'https://optimistic.etherscan.io/tx/',
      base: 'https://basescan.org/tx/',
    };
    
    return `${explorers[network as keyof typeof explorers]}${hash}`;
  };

  return (
    <div className="w-full overflow-auto">
      {transfers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer, index) => (
              <TableRow key={index}>
                <TableCell>{formatTimestamp(transfer.timestamp)}</TableCell>
                
                {/* From address with copy button */}
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-sm">{formatAddress(transfer.from)}</span>
                    <button 
                      onClick={() => copyToClipboard(transfer.from)}
                      className="text-neutral-400 hover:text-blue-500 transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress === transfer.from ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </TableCell>
                
                {/* To address with copy button */}
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-sm">{formatAddress(transfer.to)}</span>
                    <button 
                      onClick={() => copyToClipboard(transfer.to)}
                      className="text-neutral-400 hover:text-blue-500 transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress === transfer.to ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </TableCell>
                
                <TableCell className="text-right font-medium">{formatAmount(transfer.amount)}</TableCell>
                
                {/* Transaction hash with link to explorer */}
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <a 
                      href={getExplorerUrl(transfer.transaction_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      title="View on block explorer"
                    >
                      {formatAddress(transfer.transaction_hash)}
                    </a>
                    <button 
                      onClick={() => copyToClipboard(transfer.transaction_hash)}
                      className="text-neutral-400 hover:text-blue-500 transition-colors"
                      title="Copy transaction hash"
                    >
                      {copiedAddress === transfer.transaction_hash ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p>Loading transfer data...</p>
        </div>
      )}
      
      {/* Tooltip for copied address */}
      {copiedAddress && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg text-sm">
          Address copied to clipboard!
        </div>
      )}
    </div>
  );
}
