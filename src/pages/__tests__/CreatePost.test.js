import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "../CreatePost/CreatePost";
import { AuthProvider } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Faz o mock do hook useInsertDocument
jest.mock("../../hooks/useInsertDocument", () => ({
  useInsertDocument: jest.fn(),
}));

// Faz o mock do useNavigate do react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useNavigate } from "react-router-dom";

describe("CreatePost Page", () => {
  const fakeUser = { uid: "12345", displayName: "Test User" };
  const fakeInsertDocument = jest.fn();

  beforeEach(() => {
    useInsertDocument.mockReturnValue({
      insertDocument: fakeInsertDocument,
      response: { loading: false, error: null },
    });
    useNavigate.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <AuthProvider value={{ user: fakeUser }}>
        <BrowserRouter>
          <CreatePost />
        </BrowserRouter>
      </AuthProvider>
    );

  it("deve renderizar os inputs do formulário", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Pense num bom título...")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Insira uma imagem que representa seu post")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Insira o conteúdo do post")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Insira as tags separadas por vírgula")
    ).toBeInTheDocument();
  });

  it("não deve chamar insertDocument se a URL da imagem for inválida", async () => {
    renderComponent();

    // Preenche os campos com dados, mas coloca uma URL inválida para a imagem
    fireEvent.change(
      screen.getByPlaceholderText("Pense num bom título..."),
      { target: { value: "Título de Teste" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira uma imagem que representa seu post"),
      { target: { value: "url-inválida" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira o conteúdo do post"),
      { target: { value: "Conteúdo de teste" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira as tags separadas por vírgula"),
      { target: { value: "tag1, tag2" } }
    );

    // Submete o formulário clicando no botão "Criar post!"
    fireEvent.click(screen.getByText("Criar post!"));

    // Aguarda o aparecimento da mensagem de erro
    await waitFor(() => {
      expect(
        screen.getByText("A imagem precisa ser uma URL.")
      ).toBeInTheDocument();
    });
    expect(fakeInsertDocument).not.toHaveBeenCalled();
  });

  it("deve chamar insertDocument e navegar para '/' após submissão válida", async () => {
    const fakeNavigate = jest.fn();
    useNavigate.mockReturnValue(fakeNavigate);

    renderComponent();

    // Preenche os campos com dados válidos
    fireEvent.change(
      screen.getByPlaceholderText("Pense num bom título..."),
      { target: { value: "Título de Teste" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira uma imagem que representa seu post"),
      { target: { value: "http://example.com/imagem.jpg" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira o conteúdo do post"),
      { target: { value: "Conteúdo de teste" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Insira as tags separadas por vírgula"),
      { target: { value: "tag1, tag2" } }
    );

    // Submete o formulário
    fireEvent.click(screen.getByText("Criar post!"));

    // Verifica se a função insertDocument foi chamada com os dados formatados corretamente
    await waitFor(() => {
      expect(fakeInsertDocument).toHaveBeenCalledWith({
        title: "Título de Teste",
        image: "http://example.com/imagem.jpg",
        body: "Conteúdo de teste",
        tags: ["tag1", "tag2"],
        uid: fakeUser.uid,
        createdBy: fakeUser.displayName,
      });
    });
    // Verifica se a navegação foi chamada para redirecionar à home ("/")
    expect(fakeNavigate).toHaveBeenCalledWith("/");
  });
});
