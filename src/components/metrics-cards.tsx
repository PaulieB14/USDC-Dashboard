"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUSDC } from "@/lib/context/usdc-context";

// Helper function to format large numbers
function formatLargeNumber(num: number): string {
  // Now format based on size
  const billion = 1_000_000_000;
  const trillion = 1_000_000_000_000;
  
  if (num >= trillion) {
    // Format as trillions
    return `${(num / trillion).toFixed(2)}T`;
  } else if (num >= billion) {
    // Format as billions
    return `${(num / billion).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    // Format as millions
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else {
    // Format as thousands
    return `${(num / 1_000).toFixed(2)}K`;
  }
}

export default function MetricsCards() {
  const { networkMetrics, historicalSupply, historicalWalletCount, currentPrice, isLoading } = useUSDC();

  // Calculate total supply across all networks
  const totalSupply = networkMetrics.reduce((sum, metric) => sum + metric.totalSupply, 0);
  
  // Calculate total holder count across all networks
  const totalHolders = networkMetrics.reduce((sum, metric) => sum + metric.holderCount, 0);
  
  // Calculate supply change percentage (if historical data is available)
  let supplyChangePercentage = 0;
  if (historicalSupply.length >= 2) {
    const currentSupply = historicalSupply[historicalSupply.length - 1].supply;
    const previousSupply = historicalSupply[historicalSupply.length - 2].supply;
    supplyChangePercentage = ((currentSupply - previousSupply) / previousSupply) * 100;
  }
  
  // Calculate holder count change percentage (if historical data is available)
  let holderChangePercentage = 0;
  if (historicalWalletCount.length >= 2) {
    const currentCount = historicalWalletCount[historicalWalletCount.length - 1].count;
    const previousCount = historicalWalletCount[historicalWalletCount.length - 2].count;
    holderChangePercentage = ((currentCount - previousCount) / previousCount) * 100;
  }
  
  // Calculate price deviation from peg
  const priceDeviation = ((currentPrice - 1.0) / 1.0) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total USDC Supply
          </CardTitle>
          <CardDescription>
            Current circulating supply across all chains
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-emerald-700">
                ${formatLargeNumber(totalSupply)}
              </div>
              <div className={`text-sm font-medium ${supplyChangePercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {supplyChangePercentage >= 0 ? '+' : ''}{supplyChangePercentage.toFixed(2)}% from last period
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Active Wallets
          </CardTitle>
          <CardDescription>
            Unique wallets holding USDC
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-blue-700">
                {totalHolders.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${holderChangePercentage >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {holderChangePercentage >= 0 ? '+' : ''}{holderChangePercentage.toFixed(2)}% from last period
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            USDC Price
          </CardTitle>
          <CardDescription>
            Current price relative to USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-purple-700">
                ${currentPrice.toFixed(4)}
              </div>
              <div className={`text-sm font-medium ${Math.abs(priceDeviation) < 0.1 ? 'text-green-600' : 'text-amber-600'}`}>
                {priceDeviation >= 0 ? '+' : ''}{priceDeviation.toFixed(2)}% from target
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
