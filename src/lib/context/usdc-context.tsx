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

    // Check if API key is set
    const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_TOKEN;
    if (!apiKey || apiKey === 'your_graph_token_api_key_here' || apiKey === 'your_actual_api_key_here') {
      setError("API key not configured");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all data in parallel
      const [
        metricsData,
        transfersData,
        priceData
      ] = await Promise.all([
        fetchAllNetworksUSDCMetrics(),
        fetchLargeTransfers('mainnet', 10),
        getCurrentUSDCPrice('mainnet')
      ]);

      // Try to fetch historical data, but handle errors gracefully
      let supplyData: { date: string; supply: number }[] = [];
      let walletCountData: { date: string; count: number }[] = [];
      let mintBurnDataResult: MintBurnData[] = [];
      
      try {
        supplyData = await fetchHistoricalSupply();
      } catch (error) {
        console.error("Error fetching historical supply data:", error);
      }
      
      try {
        walletCountData = await fetchHistoricalWalletCount();
      } catch (error) {
        console.error("Error fetching historical wallet count data:", error);
      }
      
      try {
        mintBurnDataResult = await fetchMintBurnData();
      } catch (error) {
        console.error("Error fetching mint/burn data:", error);
      }

      setNetworkMetrics(metricsData);
      setHistoricalSupply(supplyData);
      setHistoricalWalletCount(walletCountData);
      setMintBurnData(mintBurnDataResult);
      setLargeTransfers(transfersData);
      setCurrentPrice(priceData);
    } catch (err: any) {
      console.error("Error fetching USDC data:", err);
      
      // Check for authentication errors (401)
      if (err.message && err.message.includes('401')) {
        setError("Authentication failed");
      } else if (err.message && err.message.includes('404')) {
        setError("API endpoint not found");
      } else {
        setError("Failed to load data");
      }
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
