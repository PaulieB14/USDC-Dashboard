"use client";

import { useState } from "react";
import { useToken } from "@/lib/context/token-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WalletInput() {
  const { walletAddress, setWalletAddress, fetchData, isLoading, error } = useToken();
  const [inputValue, setInputValue] = useState(walletAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && inputValue.length === 42 && inputValue.startsWith("0x")) {
      setWalletAddress(inputValue);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter Ethereum wallet address (0x...)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? "Loading..." : "Fetch Data"}
        </Button>
      </form>
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mt-2 text-sm text-neutral-500">
        <p>
          Enter an Ethereum wallet address to view real USDC data across networks.
          The dashboard will display actual token balances from The Graph Token API.
        </p>
      </div>
    </div>
  );
}
