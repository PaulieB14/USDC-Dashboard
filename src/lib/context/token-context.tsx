"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchUSDCBalances, TokenBalance } from "@/lib/api";

interface TokenContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  tokenData: { [network: string]: TokenBalance | null };
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>("0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208"); // Default address
  const [tokenData, setTokenData] = useState<{ [network: string]: TokenBalance | null }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!walletAddress || walletAddress.length < 42) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchUSDCBalances(walletAddress);
      setTokenData(data);
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError("Failed to fetch token data. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  return (
    <TokenContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        tokenData,
        isLoading,
        error,
        fetchData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
}
