"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  fetchAllNetworksUSDCMetrics, 
  fetchHistoricalSupply,
  fetchHistoricalWalletCount,
  fetchLargeTransfers,
  fetchMintBurnData,
  getCurrentUSDCPrice,
  TokenMetrics,
  TokenTransfer,
  MintBurnData
} from "@/lib/api-real";

interface USDCContextType {
  networkMetrics: TokenMetrics[];
  historicalSupply: { date: string; supply: number }[];
  historicalWalletCount: { date: string; count: number }[];
  mintBurnData: MintBurnData[];
  largeTransfers: TokenTransfer[];
  currentPrice: number;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const USDCContext = createContext<USDCContextType | undefined>(undefined);

export function USDCProvider({ children }: { children: ReactNode }) {
  const [networkMetrics, setNetworkMetrics] = useState<TokenMetrics[]>([]);
  const [historicalSupply, setHistoricalSupply] = useState<{ date: string; supply: number }[]>([]);
  const [historicalWalletCount, setHistoricalWalletCount] = useState<{ date: string; count: number }[]>([]);
  const [mintBurnData, setMintBurnData] = useState<MintBurnData[]>([]);
  const [largeTransfers, setLargeTransfers] = useState<TokenTransfer[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        metricsData,
        supplyData,
        walletCountData,
        mintBurnDataResult,
        transfersData,
        priceData
      ] = await Promise.all([
        fetchAllNetworksUSDCMetrics(),
        fetchHistoricalSupply('mainnet', 30),
        fetchHistoricalWalletCount('mainnet', 30),
        fetchMintBurnData('mainnet', 7),
        fetchLargeTransfers('mainnet', 10),
        getCurrentUSDCPrice('mainnet')
      ]);

      setNetworkMetrics(metricsData);
      setHistoricalSupply(supplyData);
      setHistoricalWalletCount(walletCountData);
      setMintBurnData(mintBurnDataResult);
      setLargeTransfers(transfersData);
      setCurrentPrice(priceData);
    } catch (err) {
      console.error("Error fetching USDC data:", err);
      setError("Failed to fetch USDC data. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <USDCContext.Provider
      value={{
        networkMetrics,
        historicalSupply,
        historicalWalletCount,
        mintBurnData,
        largeTransfers,
        currentPrice,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </USDCContext.Provider>
  );
}

export function useUSDC() {
  const context = useContext(USDCContext);
  if (context === undefined) {
    throw new Error("useUSDC must be used within a USDCProvider");
  }
  return context;
}
