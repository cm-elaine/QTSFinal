import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register/Register";

// Mock do hook useAuthentication
jest.mock("../../hooks/useAuthentication", () => ({
  useAuthentication: jest.fn(),
}));

import { useAuthentication } from "../../hooks/useAuthentication";

describe("Register Page", () => {
  const fakeCreateUser = jest.fn();
  const fakeError = null;
  const fakeLoading = false;

  beforeEach(() => {
    useAuthentication.mockReturnValue({
      createUser: fakeCreateUser,
      loginWithGoogle: jest.fn(), // ignorado
      error: fakeError,
      loading: fakeLoading,
    });
    fakeCreateUser.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar o formulário de registro", () => {
    render(<Register />);

    // Verifica o cabeçalho
    expect(
      screen.getByRole("heading", { name: /Cadastre-se para postar/i })
    ).toBeInTheDocument();

    // Verifica os campos pelo placeholder
    expect(
      screen.getByPlaceholderText(/Nome do usuário/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/E-mail do usuário/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Insira a senha/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirme a senha/i)
    ).toBeInTheDocument();
  });

  test("deve chamar createUser com os dados corretos ao submeter o formulário", async () => {
    render(<Register />);

    const testName = "Test User";
    const testEmail = "test@example.com";
    const testPassword = "password123";

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText(/Nome do usuário/i), {
      target: { value: testName },
    });
    fireEvent.change(screen.getByPlaceholderText(/E-mail do usuário/i), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira a senha/i), {
      target: { value: testPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirme a senha/i), {
      target: { value: testPassword },
    });

    // Como há dois botões com "Entrar" (um para a ação principal e outro para o Google),
    // filtramos para pegar aquele cujo texto seja exatamente "Entrar"
    const buttons = screen.getAllByRole("button", { name: /Entrar/i });
    const submitButton = buttons.find(
      (btn) => btn.textContent.trim() === "Entrar"
    );

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fakeCreateUser).toHaveBeenCalledWith({
        displayName: testName,
        email: testEmail,
        password: testPassword,
      });
    });
  });

  test("deve exibir mensagem de erro quando as senhas não coincidem", async () => {
    render(<Register />);

    const testName = "Test User";
    const testEmail = "test@example.com";
    const testPassword = "password123";
    const testConfirmPassword = "differentPassword";

    fireEvent.change(screen.getByPlaceholderText(/Nome do usuário/i), {
      target: { value: testName },
    });
    fireEvent.change(screen.getByPlaceholderText(/E-mail do usuário/i), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira a senha/i), {
      target: { value: testPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirme a senha/i), {
      target: { value: testConfirmPassword },
    });

    const buttons = screen.getAllByRole("button", { name: /Entrar/i });
    const submitButton = buttons.find(
      (btn) => btn.textContent.trim() === "Entrar"
    );

    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/As senhas precisam ser iguais/i)
    ).toBeInTheDocument();
    expect(fakeCreateUser).not.toHaveBeenCalled();
  });

  test("deve exibir mensagem de erro quando ocorrer erro na autenticação", async () => {
    const authError = "Erro no registro";
    useAuthentication.mockReturnValue({
      createUser: fakeCreateUser,
      loginWithGoogle: jest.fn(),
      error: authError,
      loading: false,
    });

    render(<Register />);

    await waitFor(() => {
      expect(screen.getByText(authError)).toBeInTheDocument();
    });
  });
});
