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
export interface TokenMetrics {
  network: string;
  totalSupply: number;
  holderCount: number;
  price: number;
  marketCap: number;
  dailyVolume: number;
}

export interface TokenTransfer {
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  transaction_hash: string;
  network: string;
}

export interface MintBurnData {
  date: string;
  minted: number;
  burned: number;
}

// Function to fetch USDC metrics for a specific network
export async function fetchNetworkUSDCMetrics(network: string): Promise<TokenMetrics> {
  const networkId = NETWORK_IDS[network] || network;
  const contractAddress = USDC_CONTRACTS[network];
  
  if (!contractAddress) {
    throw new Error(`No USDC contract address found for network: ${network}`);
  }
  
  const apiUrl = `https://token-api.thegraph.com/token/${networkId}/${contractAddress}/metrics`;
  
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
  
  const data = await response.json();
  
  return {
    network,
    totalSupply: parseFloat(data.total_supply) || 0,
    holderCount: data.holder_count || 0,
    price: data.price_usd || 1.0, // Default to 1.0 if not available
    marketCap: parseFloat(data.market_cap_usd) || 0,
    dailyVolume: parseFloat(data.volume_24h_usd) || 0,
  };
}

// Function to fetch USDC metrics across all networks
export async function fetchAllNetworksUSDCMetrics(): Promise<TokenMetrics[]> {
  const networks = Object.keys(USDC_CONTRACTS);
  const results: TokenMetrics[] = [];
  
  await Promise.all(
    networks.map(async (network) => {
      try {
        const metrics = await fetchNetworkUSDCMetrics(network);
        results.push(metrics);
      } catch (error) {
        console.error(`Error fetching metrics for ${network}:`, error);
      }
    })
  );
  
  return results;
}

// Function to fetch recent large USDC transfers
export async function fetchLargeTransfers(network: string = 'mainnet', limit: number = 10): Promise<TokenTransfer[]> {
  const contractAddress = USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network];
  
  if (!contractAddress) {
    throw new Error(`No USDC contract address found for network: ${network}`);
  }
  
  const apiUrl = `https://token-api.thegraph.com/token/${network}/${contractAddress}/transfers?limit=${limit}&min_amount=1000000`;
  
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
  
  const data = await response.json();
  
  return data.transfers.map((transfer: any) => ({
    ...transfer,
    network: network === 'mainnet' ? 'ethereum' : network,
  }));
}

// Function to fetch historical USDC supply data
export async function fetchHistoricalSupply(network: string = 'mainnet', days: number = 30): Promise<{ date: string; supply: number }[]> {
  const contractAddress = USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network];
  
  if (!contractAddress) {
    throw new Error(`No USDC contract address found for network: ${network}`);
  }
  
  const apiUrl = `https://token-api.thegraph.com/token/${network}/${contractAddress}/historical?days=${days}&metric=total_supply`;
  
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
  
  const data = await response.json();
  
  return data.datapoints.map((point: any) => ({
    date: point.timestamp.slice(0, 10), // YYYY-MM-DD format
    supply: parseFloat(point.value) || 0,
  }));
}

// Function to fetch historical wallet count data
export async function fetchHistoricalWalletCount(network: string = 'mainnet', days: number = 30): Promise<{ date: string; count: number }[]> {
  const contractAddress = USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network];
  
  if (!contractAddress) {
    throw new Error(`No USDC contract address found for network: ${network}`);
  }
  
  const apiUrl = `https://token-api.thegraph.com/token/${network}/${contractAddress}/historical?days=${days}&metric=holder_count`;
  
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
  
  const data = await response.json();
  
  return data.datapoints.map((point: any) => ({
    date: point.timestamp.slice(0, 10), // YYYY-MM-DD format
    count: parseInt(point.value) || 0,
  }));
}

// Function to fetch mint/burn data
export async function fetchMintBurnData(network: string = 'mainnet', days: number = 7): Promise<MintBurnData[]> {
  const contractAddress = USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network];
  
  if (!contractAddress) {
    throw new Error(`No USDC contract address found for network: ${network}`);
  }
  
  const apiUrl = `https://token-api.thegraph.com/token/${network}/${contractAddress}/mints-burns?days=${days}`;
  
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
  
  const data = await response.json();
  
  return data.datapoints.map((point: any) => ({
    date: point.timestamp.slice(0, 10), // YYYY-MM-DD format
    minted: parseFloat(point.minted) || 0,
    burned: parseFloat(point.burned) || 0,
  }));
}

// Function to get current USDC price
export async function getCurrentUSDCPrice(network: string = 'mainnet'): Promise<number> {
  const metrics = await fetchNetworkUSDCMetrics(network === 'mainnet' ? 'ethereum' : network);
  return metrics.price;
}
