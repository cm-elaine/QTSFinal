// Mock do módulo de configuração do Firebase para evitar a chamada de getFirestore
jest.mock("../../firebase/config", () => ({
    db: {}, // usamos um objeto vazio ou podemos criar um dummy se necessário
  }));
  
  import { renderHook, act } from "@testing-library/react";
  import { useInsertDocument } from "../useInsertDocument";
  import { collection, addDoc, Timestamp } from "firebase/firestore";
  
  // Mocks das funções do Firebase Firestore
  jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    Timestamp: {
      now: jest.fn(() => "timestamp-mock"),
    },
  }));
  
  describe("useInsertDocument Hook", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("deve inserir um documento com sucesso", async () => {
      const fakeInsertedDoc = { id: "abc123" };
      addDoc.mockResolvedValueOnce(fakeInsertedDoc);
      collection.mockReturnValueOnce("fakeCollectionRef");
  
      const { result } = renderHook(() => useInsertDocument("posts"));
  
      await act(async () => {
        await result.current.insertDocument({ title: "Teste" });
      });
  
      expect(collection).toHaveBeenCalledWith(expect.any(Object), "posts");
      expect(addDoc).toHaveBeenCalledWith("fakeCollectionRef", {
        title: "Teste",
        createdAt: "timestamp-mock",
      });
      expect(result.current.response.loading).toBe(false);
      expect(result.current.response.error).toBeNull();
    });
  
    it("deve retornar erro se a inserção falhar", async () => {
      addDoc.mockRejectedValueOnce(new Error("Erro ao inserir documento"));
      collection.mockReturnValueOnce("fakeCollectionRef");
  
      const { result } = renderHook(() => useInsertDocument("posts"));
  
      await act(async () => {
        await result.current.insertDocument({ title: "Teste" });
      });
  
      expect(result.current.response.loading).toBe(false);
      expect(result.current.response.error).toBe("Erro ao inserir documento");
    });
  
    it("não deve chamar addDoc se o hook for cancelado", async () => {
      const { result, unmount } = renderHook(() => useInsertDocument("posts"));
  
      unmount();
  
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await result.current.insertDocument({ title: "Teste" });
      });
  
      expect(addDoc).not.toHaveBeenCalled();
    });
  });
  