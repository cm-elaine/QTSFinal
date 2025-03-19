import { renderHook, waitFor } from "@testing-library/react";
import { useFetchDocument } from "../useFetchDocument";
import { doc, getDoc } from "firebase/firestore";

// Aumenta o timeout para 10 segundos para operações assíncronas
jest.setTimeout(10000);

// Mock do módulo firebase/firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  // Retorna um valor dummy para simular um docRef
  doc: jest.fn(() => "dummyDocRef"),
  // Função que será customizada em cada teste
  getDoc: jest.fn(),
}));

// Cria um objeto fakeDb estável para passar como dbInstance
const fakeDb = {};

describe("useFetchDocument Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar um documento válido", async () => {
    // Configura o mock para retornar um documento existente
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: "123",
      data: () => ({ title: "Test Post" }),
    });

    const { result } = renderHook(() =>
      useFetchDocument("posts", "123", fakeDb)
    );

    // Aguarda até que loading seja false
    await waitFor(() => expect(result.current.loading).toBe(false), {
      timeout: 5000,
    });

    expect(result.current.document).toEqual({ id: "123", title: "Test Post" });
    expect(result.current.error).toBeNull();
  });

  it("deve retornar erro se o documento não existir", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const { result } = renderHook(() =>
      useFetchDocument("posts", "invalid_id", fakeDb)
    );

    await waitFor(() => expect(result.current.loading).toBe(false), {
      timeout: 5000,
    });

    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Documento não encontrado.");
  });

  it("deve lidar com erro ao buscar o documento", async () => {
    getDoc.mockRejectedValueOnce(new Error("Erro ao buscar documento"));

    const { result } = renderHook(() =>
      useFetchDocument("posts", "123", fakeDb)
    );

    await waitFor(() => expect(result.current.loading).toBe(false), {
      timeout: 5000,
    });

    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Erro ao buscar documento");
  });

  it("deve retornar erro se os parâmetros forem inválidos", () => {
    const { result } = renderHook(() =>
      useFetchDocument("", "", fakeDb)
    );

    // Esse caso é tratado de forma síncrona
    expect(result.current.loading).toBe(false);
    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Parâmetros inválidos para buscar documento.");
  });

  it("deve retornar erro se o dbInstance não estiver configurado", () => {
    const { result } = renderHook(() =>
      useFetchDocument("posts", "123", null)
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.document).toBeNull();
    expect(result.current.error).toBe("Firestore não está configurado corretamente.");
  });
});
