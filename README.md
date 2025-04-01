# USDC Dashboard

A comprehensive dashboard for visualizing USDC metrics across multiple networks using The Graph Token API.

## Features

- Real-time USDC metrics across Ethereum, Polygon, Arbitrum, Optimism, and Base networks
- Historical supply and wallet count data
- Mint/burn activity tracking
- Large transfer monitoring
- Network distribution visualization
- USDC price stability gauge

## Technologies Used

- Next.js 15
- React
- Chart.js
- Tailwind CSS
- The Graph Token API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Graph Token API key (required)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/usdc-dashboard.git
   cd usdc-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Graph Token API key:
   ```
   NEXT_PUBLIC_GRAPH_API_TOKEN=your_actual_api_key_here
   ```
   
   **IMPORTANT**: You must replace `your_actual_api_key_here` with a valid API key from The Graph Token API. The dashboard uses only real data and will not function without a valid API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Obtaining a Graph Token API Key

To use this dashboard, you'll need a Graph Token API key:

1. Visit [The Graph Token API](https://thegraph.com/token-api) website
2. Sign up for an account or log in
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## API Endpoints Used

The dashboard uses several endpoints from The Graph Token API:

- `/token/{network}/{contract}/metrics` - For current token metrics
- `/token/{network}/{contract}/historical` - For historical supply and wallet data
- `/token/{network}/{contract}/transfers` - For large transfer data
- `/token/{network}/{contract}/mints-burns` - For mint/burn activity

## Deployment

The dashboard can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add the `NEXT_PUBLIC_GRAPH_API_TOKEN` environment variable in the Vercel project settings with your actual API key
4. Deploy the project

## License

This project is licensed under the MIT License - see the LICENSE file for details.
