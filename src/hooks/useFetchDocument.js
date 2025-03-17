import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { db as firebaseDB } from "../firebase/config";

export const useFetchDocument = (docCollection, id, dbInstance = firebaseDB) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbInstance) {
      setError("Firestore não está configurado corretamente.");
      setLoading(false);
      return;
    }

    if (!docCollection || !id) {
      setError("Parâmetros inválidos para buscar documento.");
      setLoading(false);
      return;
    }

    const loadDocument = async () => {
      setLoading(true);
      try {
        const docRef = doc(dbInstance, docCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Documento não encontrado.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [docCollection, id, dbInstance]);

  return { document, loading, error };
};
