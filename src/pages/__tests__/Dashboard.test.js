import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";

// Mocks dos hooks e contexto
jest.mock("../../contexts/AuthContext", () => ({
  useAuthValue: jest.fn(),
  // Para os testes, o AuthProvider pode ser dummy (passa os filhos)
  AuthProvider: ({ children, value }) => <div>{children}</div>,
}));

jest.mock("../../hooks/useFetchDocuments", () => ({
  useFetchDocuments: jest.fn(),
}));

jest.mock("../../hooks/useDeleteDocument", () => ({
  useDeleteDocument: jest.fn(),
}));

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

describe("Dashboard Page", () => {
  const fakeUser = { uid: "12345", displayName: "Test User" };

  beforeEach(() => {
    useAuthValue.mockReturnValue({ user: fakeUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      // Usamos o AuthProvider mockado (o dummy acima) para envolver o componente
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

  test('deve exibir "Não foram encontrados posts" e o link para criar post quando não há posts', () => {
    useFetchDocuments.mockReturnValue({ documents: [] });
    useDeleteDocument.mockReturnValue({ deleteDocument: jest.fn() });

    renderComponent();

    expect(
      screen.getByText(/Não foram encontrados posts/i)
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Criar primeiro post/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/posts/create");
  });

  test('deve renderizar o cabeçalho e os posts quando existem posts', () => {
    const fakePosts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
    ];
    useFetchDocuments.mockReturnValue({ documents: fakePosts });
    useDeleteDocument.mockReturnValue({ deleteDocument: jest.fn() });

    renderComponent();

    // Verifica o cabeçalho
    expect(screen.getByText(/Título/i)).toBeInTheDocument();
    expect(screen.getByText(/Ações/i)).toBeInTheDocument();

    // Verifica que o número de botões/links renderizados corresponde ao número de posts
    const verLinks = screen.getAllByRole("link", { name: /Ver/i });
    expect(verLinks).toHaveLength(fakePosts.length);

    const editarLinks = screen.getAllByRole("link", { name: /Editar/i });
    expect(editarLinks).toHaveLength(fakePosts.length);

    const excluirButtons = screen.getAllByRole("button", { name: /Excluir/i });
    expect(excluirButtons).toHaveLength(fakePosts.length);
  });

  test('deve chamar deleteDocument ao clicar no botão "Excluir"', () => {
    const fakePosts = [{ id: "1", title: "Post 1" }];
    const fakeDeleteDocument = jest.fn();
    useFetchDocuments.mockReturnValue({ documents: fakePosts });
    useDeleteDocument.mockReturnValue({ deleteDocument: fakeDeleteDocument });

    renderComponent();

    const deleteButton = screen.getByRole("button", { name: /Excluir/i });
    fireEvent.click(deleteButton);

    expect(fakeDeleteDocument).toHaveBeenCalledWith("1");
  });
});
