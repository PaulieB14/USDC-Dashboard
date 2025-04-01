# USDC Dashboard

A comprehensive dashboard for visualizing USDC metrics across multiple networks using The Graph Token API.

## Features

- **Multi-Network Support**: Track USDC across Ethereum, Polygon, Arbitrum, Optimism, and Base networks
- **Interactive Visualizations**: View key metrics with intuitive charts and graphs
- **Real-time Data**: Connect to The Graph Token API for up-to-date information
- **Responsive Design**: Works on desktop and mobile devices

## Key Metrics

- **Total USDC Supply**: Track the circulating supply over time
- **Minting & Burning**: Monitor daily minting and burning activity
- **Large Transfers**: View the top 10 largest transfers in the last 24 hours
- **Network Distribution**: See how USDC is distributed across different blockchains
- **Wallet Activity**: Track the number of unique wallets holding USDC
- **Peg Stability**: Monitor USDC's price stability relative to its $1.00 peg

## Technology Stack

- **Next.js**: React framework for the frontend
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Chart.js**: Flexible JavaScript charting library
- **The Graph Token API**: Data source for token information

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/PaulieB14/USDC-Dashboard.git
   cd USDC-Dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your Graph Token API JWT:
   ```
   GRAPH_API_TOKEN=your_jwt_token_here
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

This dashboard uses The Graph Token API to fetch USDC data. You'll need to:

1. Sign up on [The Graph Market](https://thegraph.com/explorer/marketplace)
2. Generate a JWT token for your API key
3. Add the token to your `.env.local` file

## License

MIT
