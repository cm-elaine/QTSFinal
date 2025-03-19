import { renderHook, waitFor } from "@testing-library/react";
import { useFetchDocument } from "../useFetchDocument";
import { getDoc, doc, getFirestore } from "firebase/firestore";

// Mock do Firestore
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(),
    })),
    doc: jest.fn(), // Mantém o mock da função doc()
    getDoc: jest.fn(), // Mock da função getDoc()
  };
});

describe("useFetchDocument Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar um documento válido", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ id: "123", title: "Test Post" }), // 🔥 Inclui `id` no mock
    });

    const { result } = renderHook(() => useFetchDocument("posts", "123"));

    // Estado inicial antes da atualização do hook
    expect(result.current.loading).toBe(true);
    expect(result.current.document).toBeNull();
    expect(result.current.error).toBeNull();

    // Aguarda atualização do hook
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Após atualização do hook
    expect(result.current.document).toEqual({
      id: "123", // 🔥 Agora o `id` está garantido
      title: "Test Post",
    });

    expect(result.current.error).toBeNull();
  });

  it("deve retornar erro se o documento não existir", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const { result } = renderHook(() => useFetchDocument("posts", "invalid_id"));

    expect(result.current.loading).toBe(true);
    expect(result.current.document).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Documento não encontrado.");
  });

  it("deve lidar com erro ao buscar o documento", async () => {
    getDoc.mockRejectedValueOnce(new Error("Erro ao buscar documento"));

    const { result } = renderHook(() => useFetchDocument("posts", "123"));

    expect(result.current.loading).toBe(true);
    expect(result.current.document).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Erro ao buscar documento");
  });
});
