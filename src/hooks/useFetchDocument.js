import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
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
        const docRef = doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Documento não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [docCollection, id]);

  return { document, loading, error };
};
