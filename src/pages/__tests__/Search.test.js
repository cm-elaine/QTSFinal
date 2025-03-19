import React from "react";
import { render, screen } from "@testing-library/react";
import Search from "../Search/Search";
import { BrowserRouter } from "react-router-dom";

// Mocks dos hooks
jest.mock("../../hooks/useFetchDocuments", () => ({
  useFetchDocuments: jest.fn(),
}));

jest.mock("../../hooks/useQuery", () => ({
  useQuery: jest.fn(),
}));

// Mock do componente PostDetail para simplificar os testes
jest.mock("../../components/PostDetail", () => ({ post }) => (
  <div data-testid="post-detail">{post.title}</div>
));

import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

describe("Search Page", () => {
  const searchTerm = "test";

  beforeEach(() => {
    // Simula o retorno do hook useQuery para fornecer o valor da query string
    useQuery.mockReturnValue({
      get: jest.fn().mockReturnValue(searchTerm),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

  test("deve renderizar o título com o termo de busca", () => {
    useFetchDocuments.mockReturnValue({ documents: [] });
    renderComponent();

    expect(
      screen.getByText(`Resultados encontrados para: ${searchTerm}`)
    ).toBeInTheDocument();
  });

  test('deve exibir mensagem "Não foram encontrados posts" e o link para voltar quando nenhum post é encontrado', () => {
    useFetchDocuments.mockReturnValue({ documents: [] });
    renderComponent();

    expect(
      screen.getByText(/Não foram encontrados posts a partir da sua busca/i)
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Voltar/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/");
  });

  test("deve renderizar a lista de posts quando existem posts", () => {
    const fakePosts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
    ];
    useFetchDocuments.mockReturnValue({ documents: fakePosts });
    renderComponent();

    // Verifica se os títulos dos posts (fornecidos pelo componente mock PostDetail) estão na tela
    fakePosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });
});
