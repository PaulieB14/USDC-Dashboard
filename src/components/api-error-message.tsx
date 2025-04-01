"use client";

import { useUSDC } from "@/lib/context/usdc-context";

export default function ApiErrorMessage() {
  const { error } = useUSDC();

  if (!error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-red-700 mb-2">API Error</h2>
      <p className="text-red-600 mb-4">{error}</p>
      
      <div className="bg-white p-4 rounded border border-red-100">
        <h3 className="text-lg font-medium text-gray-800 mb-2">How to fix this:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Get an API key</span> from{" "}
            <a 
              href="https://thegraph.com/token-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              The Graph Token API
            </a>
          </li>
          <li>
            <span className="font-medium">Open the <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file</span> in the root directory of the project
          </li>
          <li>
            <span className="font-medium">Replace the placeholder</span> with your actual API key:
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              <code>NEXT_PUBLIC_GRAPH_API_TOKEN=your_actual_api_key_here</code>
            </pre>
          </li>
          <li>
            <span className="font-medium">Restart the development server</span> with <code className="bg-gray-100 px-1 py-0.5 rounded">npm run dev</code>
          </li>
        </ol>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        This dashboard uses real data from The Graph Token API and requires a valid API key to function properly.
      </p>
    </div>
  );
}
