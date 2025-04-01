// API service for The Graph Token API - Real Data Implementation

// Import all real API functions from api-real.ts
import {
  fetchTokenBalances,
  fetchTokenTransfers,
  fetchNetworkUSDCMetrics,
  fetchAllNetworksUSDCMetrics,
  fetchLargeTransfers,
  fetchHistoricalSupply,
  fetchHistoricalWalletCount,
  fetchMintBurnData,
  getCurrentUSDCPrice,
  TokenBalance,
  TokenBalancesResponse,
  TokenTransfer,
  TokenMetrics,
  MintBurnData,
  USDC_CONTRACTS,
} from './api-real';

// Re-export functions and values
export {
  fetchTokenBalances,
  fetchTokenTransfers,
  fetchNetworkUSDCMetrics,
  fetchAllNetworksUSDCMetrics,
  fetchLargeTransfers,
  fetchHistoricalSupply,
  fetchHistoricalWalletCount,
  fetchMintBurnData,
  getCurrentUSDCPrice,
  USDC_CONTRACTS,
};

// Re-export types
export type {
  TokenBalance,
  TokenBalancesResponse,
  TokenTransfer,
  TokenMetrics,
  MintBurnData,
};

// Function to fetch USDC balances across multiple networks
export async function fetchUSDCBalances(address: string): Promise<{ [network: string]: TokenBalance | null }> {
  const networks = Object.keys(USDC_CONTRACTS);
  const results: { [network: string]: TokenBalance | null } = {};
  
  // Use Promise.all to fetch data for all networks in parallel
  await Promise.all(
    networks.map(async (network) => {
      try {
        // Use a known address that holds USDC if no address is provided
        const targetAddress = address || '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503';
        
        // Get the network ID
        const networkId = network === 'ethereum' ? 'mainnet' : 
                         network === 'polygon' ? 'matic' : 
                         network === 'arbitrum' ? 'arbitrum-one' : 
                         network === 'optimism' ? 'optimism' : 
                         network === 'base' ? 'base' : network;
        
        // Fetch token balances
        const response = await fetchTokenBalances(targetAddress, networkId);
        
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
