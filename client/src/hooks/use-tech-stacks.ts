import { useState, useEffect } from "react";
import { getTechStacks } from "@/lib/firebase-service";

export function useTechStacks() {
  const [techStacks, setTechStacks] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechStacks() {
      try {
        setLoading(true);
        const stacks = await getTechStacks();
        setTechStacks(stacks);
        setError(null);
      } catch (err) {
        console.error("Error loading tech stacks:", err);
        setError("Failed to load tech stacks");
      } finally {
        setLoading(false);
      }
    }

    fetchTechStacks();
  }, []);

  return { techStacks, loading, error };
}
