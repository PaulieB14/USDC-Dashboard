/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GRAPH_API_TOKEN: process.env.GRAPH_API_TOKEN,
  },
};

module.exports = nextConfig;
