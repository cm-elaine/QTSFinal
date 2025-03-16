import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import App from "./App";

jest.setTimeout(30000); // Aumenta o timeout global para evitar falhas por tempo limite

// Mock de autenticação para evitar chamadas reais ao Firebase
jest.mock("./hooks/useAuthentication", () => ({
  useAuthentication: () => ({
    auth: {
      onAuthStateChanged: jest.fn().mockImplementation((callback) => {
        const unsubscribe = jest.fn(); // Mock correto da função de cancelamento
        setTimeout(() => callback(null), 100); // Simula um pequeno delay no carregamento
        return unsubscribe;
      }),
    },
  }),
}));

test("renders MiniBlog title", async () => {
  await act(async () => {
    render(<App />);
  });

  // Aguarda até que o "Carregando..." desapareça antes de continuar
  await waitFor(() => {
    expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
  }, { timeout: 5000 });

  // Busca pelo link da navbar com o nome "Mini Blog"
  await waitFor(() => {
    expect(screen.getByRole("link", { name: /mini blog/i })).toBeInTheDocument();
  }, { timeout: 5000 });
});