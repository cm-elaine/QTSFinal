import { renderHook, act } from "@testing-library/react";
import { useDeleteDocument } from "../useDeleteDocument";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

// Mock do Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})), // Mock do Firestore
  doc: jest.fn(), // Mock da função doc()
  deleteDoc: jest.fn(), // Mock da função deleteDoc()
}));

describe("useDeleteDocument Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve excluir um documento com sucesso", async () => {
    deleteDoc.mockResolvedValueOnce(); // Mock de sucesso

    const { result } = renderHook(() => useDeleteDocument("posts"));

    await act(async () => {
      await result.current.deleteDocument("123");
    });

    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(doc({}, "posts", "123"));
    expect(result.current.response.loading).toBe(false);
    expect(result.current.response.error).toBeNull();
  });

  it("deve retornar erro se a exclusão falhar", async () => {
    deleteDoc.mockRejectedValueOnce(new Error("Erro ao excluir documento"));

    const { result } = renderHook(() => useDeleteDocument("posts"));

    await act(async () => {
      await result.current.deleteDocument("123");
    });

    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(result.current.response.loading).toBe(false);
    expect(result.current.response.error).toBe("Erro ao excluir documento");
  });

  it("não deve chamar deleteDoc se o hook for cancelado", async () => {
    const { result, unmount } = renderHook(() => useDeleteDocument("posts"));

    unmount(); // Cancela o hook antes de chamar deleteDocument

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Aguarda um tempo para garantir que o estado seja atualizado
      await result.current.deleteDocument("123");
    });

    expect(deleteDoc).not.toHaveBeenCalled(); // deleteDoc NÃO deve ser chamado
  });
});
