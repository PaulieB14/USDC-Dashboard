// Real API service for The Graph Token API - Global USDC Data

// USDC contract addresses on different networks
const USDC_CONTRACTS: { [key: string]: string } = {
  ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Ethereum Mainnet
  polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // Polygon
  arbitrum: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // Arbitrum
  optimism: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // Optimism
  base: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base
};

// Network IDs for API calls
const NETWORK_IDS: { [key: string]: string } = {
  ethereum: 'mainnet',
  polygon: 'matic',
  arbitrum: 'arbitrum-one',
  optimism: 'optimism',
  base: 'base',
};

// Types for API responses
export interface TokenBalance {
  contract: string;
  amount: string;
  decimals: number;
  name: string;
  symbol: string;
  price_usd: number;
  value_usd: number;
  network_id: string;
}

export interface TokenBalancesResponse {
  data: TokenBalance[];
  meta: {
    network: string;
    address: string;
    timestamp: string;
  };
}

export interface TokenTransfer {
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  transaction_hash: string;
  network: string;
}

export interface TokenMetrics {
  network: string;
  totalSupply: number;
  holderCount: number;
  price: number;
  marketCap: number;
  dailyVolume: number;
}

export interface MintBurnData {
  date: string;
  minted: number;
  burned: number;
}

// Function to fetch token balances for a specific address and network
export async function fetchTokenBalances(address: string, network: string): Promise<TokenBalancesResponse> {
  const apiUrl = `https://token-api.thegraph.com/balances/evm/${address}?network_id=${network}`;
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Function to fetch token transfers for a specific address and network
export async function fetchTokenTransfers(address: string, network: string, limit: number = 10): Promise<any> {
  const apiUrl = `https://token-api.thegraph.com/transfers/evm/${address}?network_id=${network}&limit=${limit}`;
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Function to fetch USDC metrics for a specific network
export async function fetchNetworkUSDCMetrics(network: string): Promise<TokenMetrics> {
  const networkId = NETWORK_IDS[network] || network;
  const contract = USDC_CONTRACTS[network];
  
  if (!contract) {
    throw new Error(`No USDC contract found for network: ${network}`);
  }
  
  // Use a known address that holds USDC
  const address = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'; // Binance
  const response = await fetchTokenBalances(address, networkId);
  
  // Find USDC in the response
  const usdc = response.data.find(
    (token) => token.contract.toLowerCase() === contract.toLowerCase()
  );
  
  if (!usdc) {
    throw new Error(`No USDC found for address ${address} on network ${network}`);
  }
  
  return {
    network,
    totalSupply: parseFloat(usdc.amount) * Math.pow(10, usdc.decimals),
    holderCount: 0, // Not available in this API
    price: usdc.price_usd || 1.0,
    marketCap: usdc.value_usd || 0,
    dailyVolume: 0, // Not available in this API
  };
}

// Function to fetch USDC metrics across all networks
export async function fetchAllNetworksUSDCMetrics(): Promise<TokenMetrics[]> {
  const networks = Object.keys(USDC_CONTRACTS);
  const results: TokenMetrics[] = [];
  
  for (const network of networks) {
    try {
      const metrics = await fetchNetworkUSDCMetrics(network);
      results.push(metrics);
    } catch (error) {
      console.error(`Error fetching metrics for ${network}:`, error);
      // Do not add fallback data, just skip this network
    }
  }
  
  return results;
}

// Function to fetch recent large USDC transfers
export async function fetchLargeTransfers(network: string = 'mainnet', limit: number = 10): Promise<TokenTransfer[]> {
  const networkId = NETWORK_IDS[network] || network;
  const contract = USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network];
  
  if (!contract) {
    throw new Error(`No USDC contract found for network: ${network}`);
  }
  
  // Use a known address that has USDC transfers
  const address = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'; // Binance
  const response = await fetchTokenTransfers(address, networkId, limit);
  
  // Filter for USDC transfers
  const usdcTransfers = response.transfers.filter((transfer: any) => 
    transfer.contract.toLowerCase() === contract.toLowerCase()
  );
  
  return usdcTransfers.map((transfer: any) => ({
    from: transfer.from,
    to: transfer.to,
    amount: transfer.amount,
    timestamp: transfer.timestamp,
    transaction_hash: transfer.transaction_hash,
    network: network === 'mainnet' ? 'ethereum' : network,
  }));
}

// Function to fetch historical USDC supply data
export async function fetchHistoricalSupply(): Promise<{ date: string; supply: number }[]> {
  // For historical data, we would need a time series API
  // Since The Graph Token API doesn't provide this directly, we'll throw an error
  throw new Error('Historical supply data not available from API');
}

// Function to fetch historical wallet count data
export async function fetchHistoricalWalletCount(): Promise<{ date: string; count: number }[]> {
  // For historical data, we would need a time series API
  // Since The Graph Token API doesn't provide this directly, we'll throw an error
  throw new Error('Historical wallet count data not available from API');
}

// Function to fetch mint/burn data
export async function fetchMintBurnData(): Promise<MintBurnData[]> {
  // For mint/burn data, we would need a specialized API
  // Since The Graph Token API doesn't provide this directly, we'll throw an error
  throw new Error('Mint/burn data not available from API');
}

// Function to get current USDC price
export async function getCurrentUSDCPrice(network: string = 'mainnet'): Promise<number> {
  const metrics = await fetchNetworkUSDCMetrics(network);
  return metrics.price;
}
