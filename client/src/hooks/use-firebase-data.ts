import { useState, useEffect } from "react";
import {
  getAboutData,
  getProjectsData,
  getContactData,
  getSocialData,
  getGalleryData,
  getNotepadData,
  getTerminalData,
  getDatabaseData,
  getSettingsData,
  getAllData
} from "@/lib/firebase-service";

export function useFirebaseData<T>(
  collectionName: string,
  fetchFunction: () => Promise<T | null>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [collectionName]);

  return { data, loading, error, refetch: () => fetchFunction().then(setData) };
}

export function useAboutData() {
  return useFirebaseData("about", getAboutData);
}

export function useProjectsData() {
  return useFirebaseData("projects", getProjectsData);
}

export function useContactData() {
  return useFirebaseData("contact", getContactData);
}

export function useSocialData() {
  return useFirebaseData("social", getSocialData);
}

export function useGalleryData() {
  return useFirebaseData("gallery", getGalleryData);
}

export function useNotepadData() {
  return useFirebaseData("notepad", getNotepadData);
}

export function useTerminalData() {
  return useFirebaseData("terminal", getTerminalData);
}

export function useDatabaseData() {
  return useFirebaseData("database", getDatabaseData);
}

export function useSettingsData() {
  return useFirebaseData("settings", getSettingsData);
}

export function useAllData() {
  return useFirebaseData("all", getAllData);
}
