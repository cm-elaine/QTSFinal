import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import { BrowserRouter } from "react-router-dom";

// Mocks dos hooks
jest.mock("../../hooks/useAuthentication", () => ({
  useAuthentication: jest.fn(),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuthValue: jest.fn(),
}));

import { useAuthentication } from "../../hooks/useAuthentication";
import { useAuthValue } from "../../contexts/AuthContext";

describe("Navbar", () => {
  const fakeUser = { uid: "12345", displayName: "Test User" };

  beforeEach(() => {
    useAuthValue.mockReturnValue({ user: fakeUser });
    useAuthentication.mockReturnValue({ logout: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

  test("deve renderizar a Navbar com os links corretos quando o usuário está logado", () => {
    renderComponent();

    // Verifica se os links de "Novo post" e "Dashboard" estão presentes
    expect(screen.getByText(/Novo post/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    // Verifica se o botão "Sair" está presente
    expect(screen.getByRole("button", { name: /Sair/i })).toBeInTheDocument();
  });

  test("deve renderizar a Navbar com os links de login e registro quando o usuário não está logado", () => {
    useAuthValue.mockReturnValue({ user: null });
    renderComponent();

    // Verifica se os links "Entrar" e "Cadastrar" estão presentes
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastrar/i)).toBeInTheDocument();

    // Verifica que o botão "Sair" não está presente
    expect(screen.queryByRole("button", { name: /Sair/i })).not.toBeInTheDocument();
  });
});
