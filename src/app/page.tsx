import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TotalSupplyChart from "@/components/charts/total-supply-chart";
import MintBurnChart from "@/components/charts/mint-burn-chart";
import TopTransfersTable from "@/components/charts/top-transfers-table";
import NetworkDistributionChart from "@/components/charts/network-distribution-chart";
import WalletCountChart from "@/components/charts/wallet-count-chart";
import PegStabilityGauge from "@/components/charts/peg-stability-gauge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-2">USDC Dashboard</h1>
          <p className="text-emerald-100 text-lg max-w-3xl">
            Visualizing USDC metrics across multiple networks using The Graph Token API
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              Ethereum
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
              Polygon
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
              Arbitrum
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
              Optimism
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              Base
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full p-6">

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
              <div className="text-4xl font-bold text-emerald-700">$30.2B</div>
              <div className="text-sm text-emerald-600 font-medium">+2.3% from last month</div>
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
              <div className="text-4xl font-bold text-blue-700">512,487</div>
              <div className="text-sm text-blue-600 font-medium">+1.8% from last week</div>
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
              <div className="text-4xl font-bold text-purple-700">$0.9998</div>
              <div className="text-sm text-purple-600 font-medium">-0.02% from target</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="max-w-7xl mx-auto w-full p-6 space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supply">Supply Metrics</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Total USDC Supply Over Time
                </CardTitle>
                <CardDescription>Monthly trend of circulating supply</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <TotalSupplyChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  USDC Minted vs Burned
                </CardTitle>
                <CardDescription>Daily minting and burning activity</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <MintBurnChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Unique Wallets Holding USDC
                </CardTitle>
                <CardDescription>Daily trend of active wallets</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <WalletCountChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  USDC Peg Stability
                </CardTitle>
                <CardDescription>Current price relative to USD</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PegStabilityGauge />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="supply" className="space-y-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Total USDC Supply Over Time
              </CardTitle>
              <CardDescription>Monthly trend of circulating supply</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <TotalSupplyChart />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                USDC Minted vs Burned
              </CardTitle>
              <CardDescription>Daily minting and burning activity</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <MintBurnChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transfers" className="space-y-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-neutral-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Top 10 Largest Transfers (24h)
              </CardTitle>
              <CardDescription>Largest USDC transfers in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <TopTransfersTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="networks" className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">Multi-Network USDC Analysis</h3>
            <p className="text-neutral-600 mb-4">
              This dashboard tracks USDC across all major EVM-compatible networks. The Graph Token API provides 
              comprehensive data for USDC on Ethereum, Polygon, Arbitrum, Optimism, and Base networks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <h4 className="font-medium">Ethereum</h4>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Primary USDC network with highest liquidity</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                  <h4 className="font-medium">Polygon</h4>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Popular for lower fees and faster transactions</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2"></div>
                  <h4 className="font-medium">Arbitrum</h4>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Layer 2 scaling solution with growing adoption</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <h4 className="font-medium">Optimism</h4>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Optimistic rollup with Ethereum security</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <h4 className="font-medium">Base</h4>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Newer L2 with growing ecosystem</p>
              </div>
            </div>
          </div>
          
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>USDC Distribution by Network</CardTitle>
              <CardDescription>USDC holdings across different blockchains</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <NetworkDistributionChart />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Network Comparison</CardTitle>
                <CardDescription>Key metrics across networks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Network</th>
                        <th className="text-right py-2">USDC Supply</th>
                        <th className="text-right py-2">Active Wallets</th>
                        <th className="text-right py-2">Avg. Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                          Ethereum
                        </td>
                        <td className="text-right py-2">$18.5B</td>
                        <td className="text-right py-2">284,521</td>
                        <td className="text-right py-2">$12,450</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                          Polygon
                        </td>
                        <td className="text-right py-2">$5.2B</td>
                        <td className="text-right py-2">156,782</td>
                        <td className="text-right py-2">$3,250</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                          Arbitrum
                        </td>
                        <td className="text-right py-2">$3.1B</td>
                        <td className="text-right py-2">89,456</td>
                        <td className="text-right py-2">$5,780</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                          Optimism
                        </td>
                        <td className="text-right py-2">$2.4B</td>
                        <td className="text-right py-2">62,345</td>
                        <td className="text-right py-2">$4,120</td>
                      </tr>
                      <tr>
                        <td className="py-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          Base
                        </td>
                        <td className="text-right py-2">$1.0B</td>
                        <td className="text-right py-2">42,891</td>
                        <td className="text-right py-2">$2,890</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Network Growth Trends</CardTitle>
                <CardDescription>Month-over-month growth by network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                        Ethereum
                      </span>
                      <span className="text-sm font-medium text-blue-600">+1.2%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                        Polygon
                      </span>
                      <span className="text-sm font-medium text-purple-600">+3.8%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                        Arbitrum
                      </span>
                      <span className="text-sm font-medium text-cyan-600">+5.2%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                        Optimism
                      </span>
                      <span className="text-sm font-medium text-red-600">+4.7%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        Base
                      </span>
                      <span className="text-sm font-medium text-blue-600">+8.9%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
