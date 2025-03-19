import { useEffect, useReducer, useRef } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState);

  // Usamos useRef para lidar com cancelamento imediatamente
  const cancelled = useRef(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled.current) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id) => {
    // Se já estiver cancelado, não prossegue
    if (cancelled.current) return;

    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      // Apenas executa deleteDoc se o hook não estiver cancelado
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      if (cancelled.current) return;

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
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

  return { deleteDocument, response };
};
