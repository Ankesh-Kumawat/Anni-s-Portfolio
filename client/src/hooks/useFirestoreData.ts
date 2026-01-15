import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * Hook to fetch data from Firestore with real-time updates
 * @param collectionName - Firestore collection name (e.g., 'projects', 'notepad')
 * @param docId - Document ID (default: 'main')
 * @returns { data, loading, error }
 */
export function useFirestoreData<T>(
    collectionName: string,
    docId: string = 'main'
): {
    data: T | null;
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!collectionName) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, collectionName, docId);

        // Real-time listener
        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setData(snapshot.data() as T);
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, docId]);

    return { data, loading, error };
}
