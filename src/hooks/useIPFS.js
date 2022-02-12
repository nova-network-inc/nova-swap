import { useCallback } from "react";

export const useIPFS = () => {
  const resolveLink = useCallback((url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  }, [])

  return { resolveLink };
};
