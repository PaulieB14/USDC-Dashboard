"use client";

import { useUSDC } from "@/lib/context/usdc-context";

export default function ApiErrorMessage() {
  const { error } = useUSDC();

  if (!error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 font-medium">Error: {error}</p>
    </div>
  );
}
