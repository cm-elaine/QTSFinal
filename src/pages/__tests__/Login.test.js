import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login/Login";

// Mock do hook useAuthentication
jest.mock("../../hooks/useAuthentication", () => ({
  useAuthentication: jest.fn(),
}));

import { useAuthentication } from "../../hooks/useAuthentication";

describe("Login Page", () => {
  const fakeLogin = jest.fn();
  const fakeError = null;
  const fakeLoading = false;

  beforeEach(() => {
    // Resetar os mocks antes de cada teste
    fakeLogin.mockReset();
    useAuthentication.mockReturnValue({
      login: fakeLogin,
      error: fakeError,
      loading: fakeLoading,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar o formulário de login", () => {
    render(<Login />);

    // Verifica o cabeçalho "Entrar" (usando role heading)
    expect(screen.getByRole("heading", { name: /Entrar/i })).toBeInTheDocument();
    // Verifica os inputs pelo placeholder
    expect(screen.getByPlaceholderText(/E-mail do usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Insira a senha/i)).toBeInTheDocument();

    // Para o botão de login, como há dois (um para login comum e outro para Google),
    // buscamos os botões com texto "Entrar" e filtramos o que tenha exatamente "Entrar"
    const buttons = screen.getAllByRole("button", { name: /Entrar/i });
    const loginButton = buttons.find(
      (btn) => btn.textContent.trim() === "Entrar"
    );
    expect(loginButton).toBeInTheDocument();
  });

  test("deve chamar login com os dados corretos ao submeter o formulário", async () => {
    const testEmail = "test@example.com";
    const testPassword = "password123";
    fakeLogin.mockResolvedValue("success");

    render(<Login />);

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText(/E-mail do usuário/i), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira a senha/i), {
      target: { value: testPassword },
    });

    // Encontra o botão de login principal (texto exatamente "Entrar")
    const buttons = screen.getAllByRole("button", { name: /Entrar/i });
    const loginButton = buttons.find(
      (btn) => btn.textContent.trim() === "Entrar"
    );

    // Submete o formulário clicando no botão
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(fakeLogin).toHaveBeenCalledWith({
        email: testEmail,
        password: testPassword,
      });
    });
  });

  test("deve exibir mensagem de erro quando ocorrer erro na autenticação", async () => {
    // Simula um erro na autenticação
    useAuthentication.mockReturnValue({
      login: fakeLogin,
      error: "Credenciais inválidas",
      loading: false,
    });

    render(<Login />);

    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
