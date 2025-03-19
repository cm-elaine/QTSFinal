import { renderHook, act } from "@testing-library/react";
import { useUpdateDocument } from "../useUpdateDocument";
import { doc, updateDoc } from "firebase/firestore";

// Mock do módulo de configuração do Firebase para evitar inicialização real
jest.mock("../../firebase/config", () => ({
  db: {},
}));

// Mocks das funções do Firebase Firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("useUpdateDocument Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar um documento com sucesso", async () => {
    updateDoc.mockResolvedValueOnce({ success: true });
    doc.mockReturnValueOnce("fakeDocRef");

    const { result } = renderHook(() => useUpdateDocument("posts"));

    await act(async () => {
      await result.current.updateDocument("123", { title: "Updated" });
    });

    expect(doc).toHaveBeenCalledWith(expect.any(Object), "posts", "123");
    expect(updateDoc).toHaveBeenCalledWith("fakeDocRef", { title: "Updated" });
    expect(result.current.response.loading).toBe(false);
    expect(result.current.response.error).toBeNull();
  });

  it("deve retornar erro se a atualização falhar", async () => {
    updateDoc.mockRejectedValueOnce(new Error("Erro na atualização"));
    doc.mockReturnValueOnce("fakeDocRef");

    const { result } = renderHook(() => useUpdateDocument("posts"));

    await act(async () => {
      await result.current.updateDocument("123", { title: "Updated" });
    });

    expect(result.current.response.loading).toBe(false);
    expect(result.current.response.error).toBe("Erro na atualização");
  });

  it("não deve chamar updateDoc se o hook for cancelado", async () => {
    const { result, unmount } = renderHook(() => useUpdateDocument("posts"));

    unmount(); // Cancela o hook

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await result.current.updateDocument("123", { title: "Updated" });
    });

    expect(updateDoc).not.toHaveBeenCalled();
  });
});
