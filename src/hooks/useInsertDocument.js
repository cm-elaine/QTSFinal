import { useReducer, useEffect, useRef } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  // Usamos useRef para o controle de cancelamento
  const cancelled = useRef(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled.current) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    // Verifica imediatamente se o hook foi cancelado
    if (cancelled.current) return;

    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };

      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      // Se foi cancelado durante a operação, não despacha ação
      if (cancelled.current) return;

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      });
    } catch (error) {
      if (cancelled.current) return;
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    return () => {
      cancelled.current = true;
    };
  }, []);

  return { insertDocument, response };
};
