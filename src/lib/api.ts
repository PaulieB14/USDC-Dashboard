// API service for The Graph Token API

// USDC contract addresses on different networks
const USDC_CONTRACTS: { [key: string]: string } = {
  ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Ethereum Mainnet
  polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // Polygon
  arbitrum: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // Arbitrum
  optimism: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // Optimism
  base: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base
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
}

// Function to fetch token balances for a specific address and network
export async function fetchTokenBalances(address: string, network: string = 'mainnet'): Promise<TokenBalancesResponse> {
  const apiUrl = `https://token-api.thegraph.com/balances/evm/${address}?network_id=${network}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
}

// Function to fetch USDC balances across multiple networks
export async function fetchUSDCBalances(address: string): Promise<{ [network: string]: TokenBalance | null }> {
  const networks = Object.keys(USDC_CONTRACTS);
  const results: { [network: string]: TokenBalance | null } = {};
  
  await Promise.all(
    networks.map(async (network) => {
      try {
        const networkId = network === 'ethereum' ? 'mainnet' : 
                         network === 'polygon' ? 'matic' : 
                         network === 'arbitrum' ? 'arbitrum-one' : network;
        
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

// Function to simulate historical USDC supply data (since we don't have historical data in this demo)
export function simulateHistoricalUSDCSupply(): { date: string; supply: number }[] {
  const data = [];
  const today = new Date();
  const baseSupply = 30_000_000_000; // 30 billion
  
  // Generate data for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Random growth factor between 0.98 and 1.05
    const growthFactor = 0.98 + Math.random() * 0.07;
    const supply = baseSupply * Math.pow(growthFactor, i);
    
    data.unshift({
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      supply: Math.round(supply),
    });
  }
  
  return data;
}

// Function to simulate daily mint/burn data
export function simulateMintBurnData(): { date: string; minted: number; burned: number }[] {
  const data = [];
  const today = new Date();
  
  // Generate data for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random mint between 50M and 200M
    const minted = Math.round(50_000_000 + Math.random() * 150_000_000);
    
    // Random burn between 40M and 180M
    const burned = Math.round(40_000_000 + Math.random() * 140_000_000);
    
    data.unshift({
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      minted,
      burned,
    });
  }
  
  return data;
}

// Function to simulate large transfers
export function simulateLargeTransfers(): TokenTransfer[] {
  const transfers = [];
  const now = new Date();
  
  // Generate 10 random large transfers
  for (let i = 0; i < 10; i++) {
    const randomTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    transfers.push({
      from: `0x${Math.random().toString(16).slice(2, 42)}`,
      to: `0x${Math.random().toString(16).slice(2, 42)}`,
      amount: (1_000_000 + Math.random() * 10_000_000).toString(),
      timestamp: randomTime.toISOString(),
      transaction_hash: `0x${Math.random().toString(16).slice(2, 66)}`,
    });
  }
  
  // Sort by timestamp (most recent first)
  return transfers.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Function to simulate wallet count data
export function simulateWalletCountData(): { date: string; count: number }[] {
  const data = [];
  const today = new Date();
  const baseCount = 500_000; // 500k wallets
  
  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random growth factor between 0.995 and 1.015
    const growthFactor = 0.995 + Math.random() * 0.02;
    const count = baseCount * Math.pow(growthFactor, i);
    
    data.unshift({
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD format
      count: Math.round(count),
    });
  }
  
  return data;
}

// Function to get current USDC price (simulated with slight variations around $1)
export function getCurrentUSDCPrice(): number {
  // Random price between $0.995 and $1.005
  return 0.995 + Math.random() * 0.01;
}
