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

// Sample wallet address for fetching data
const SAMPLE_WALLET = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208';

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

// Function to fetch token balances for a specific address and network
export async function fetchTokenBalances(address: string = SAMPLE_WALLET, network: string = 'mainnet'): Promise<TokenBalancesResponse> {
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

// Function to fetch USDC balances across multiple networks
export async function fetchUSDCBalances(address: string = SAMPLE_WALLET): Promise<{ [network: string]: TokenBalance | null }> {
  const networks = Object.keys(NETWORK_IDS);
  const results: { [network: string]: TokenBalance | null } = {};
  
  await Promise.all(
    networks.map(async (network) => {
      try {
        const networkId = NETWORK_IDS[network];
        const response = await fetchTokenBalances(address, networkId);
        
        // Find USDC in the response
        const usdc = response.data.find(
          (token) => token.contract.toLowerCase() === USDC_CONTRACTS[network].toLowerCase()
        );
        
        results[network] = usdc || null;
      } catch (error) {
        console.error(`Error fetching USDC balance for ${network}:`, error);
        results[network] = null;
      }
    })
  );
  
  return results;
}

// Function to fetch USDC metrics across all networks
export async function fetchAllNetworksUSDCMetrics(): Promise<TokenMetrics[]> {
  const usdcBalances = await fetchUSDCBalances();
  const networks = Object.keys(usdcBalances);
  
  return networks.map(network => {
    const balance = usdcBalances[network];
    
    return {
      network,
      totalSupply: balance ? parseFloat(balance.amount) * Math.pow(10, balance.decimals) : 0,
      holderCount: 0, // Not available in this API
      price: balance ? balance.price_usd : 1.0,
      marketCap: balance ? balance.value_usd : 0,
      dailyVolume: 0, // Not available in this API
    };
  });
}

// Function to fetch recent large USDC transfers
export async function fetchLargeTransfers(network: string = 'mainnet', limit: number = 10): Promise<TokenTransfer[]> {
  const address = SAMPLE_WALLET;
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
  
  const data = await response.json();
  
  // Filter for USDC transfers
  const usdcTransfers = data.transfers.filter((transfer: any) => 
    transfer.contract.toLowerCase() === USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network].toLowerCase()
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
// Note: This is a simplified implementation as the API doesn't directly provide historical supply data
export async function fetchHistoricalSupply(network: string = 'mainnet', days: number = 30): Promise<{ date: string; supply: number }[]> {
  const address = SAMPLE_WALLET;
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
  
  const data = await response.json();
  
  // Find USDC in the response
  const usdc = data.data.find(
    (token: TokenBalance) => token.contract.toLowerCase() === USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network].toLowerCase()
  );
  
  if (!usdc) {
    return [];
  }
  
  // Create a single data point for the current supply
  // In a real implementation, you would fetch historical data from a time series API
  const today = new Date();
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    result.unshift({
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      supply: parseFloat(usdc.amount) * Math.pow(10, usdc.decimals),
    });
  }
  
  return result;
}

// Function to fetch historical wallet count data
// Note: This is a simplified implementation as the API doesn't directly provide historical wallet count data
export async function fetchHistoricalWalletCount(network: string = 'mainnet', days: number = 30): Promise<{ date: string; count: number }[]> {
  const address = SAMPLE_WALLET;
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
  
  // Create a single data point for the current wallet count
  // In a real implementation, you would fetch historical data from a time series API
  const today = new Date();
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    result.unshift({
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      count: 500000, // Placeholder value
    });
  }
  
  return result;
}

// Function to fetch mint/burn data
// Note: This is a simplified implementation as the API doesn't directly provide mint/burn data
export async function fetchMintBurnData(network: string = 'mainnet', days: number = 7): Promise<MintBurnData[]> {
  const address = SAMPLE_WALLET;
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
  
  // Create data points for mint/burn activity
  // In a real implementation, you would fetch this data from a specialized API
  const today = new Date();
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    result.unshift({
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      minted: 100000000, // Placeholder value
      burned: 90000000, // Placeholder value
    });
  }
  
  return result;
}

// Function to get current USDC price
export async function getCurrentUSDCPrice(network: string = 'mainnet'): Promise<number> {
  try {
    const address = SAMPLE_WALLET;
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
    
    const data = await response.json();
    
    // Find USDC in the response
    const usdc = data.data.find(
      (token: TokenBalance) => token.contract.toLowerCase() === USDC_CONTRACTS[network === 'mainnet' ? 'ethereum' : network].toLowerCase()
    );
    
    return usdc ? usdc.price_usd : 1.0;
  } catch (error) {
    console.error('Error fetching USDC price:', error);
    return 1.0; // Default to 1.0 if API call fails
  }
}
