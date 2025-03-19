import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditPost from "../EditPost/EditPost";
import { BrowserRouter } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

// Mock dos hooks do React Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mocks dos nossos hooks e contexto
jest.mock("../../contexts/AuthContext", () => ({
  useAuthValue: jest.fn(),
}));

jest.mock("../../hooks/useFetchDocument", () => ({
  useFetchDocument: jest.fn(),
}));

jest.mock("../../hooks/useUpdateDocument", () => ({
  useUpdateDocument: jest.fn(),
}));

describe("EditPost Page", () => {
  const fakeUser = { uid: "12345", displayName: "Test User" };
  const fakePost = {
    id: "1",
    title: "Post 1",
    image: "https://example.com/image.jpg",
    body: "Conteúdo do post 1",
    tags: ["tag1", "tag2"],
  };

  const mockedNavigate = jest.fn();
  const mockedUpdateDocument = jest.fn();

  beforeEach(() => {
    // Mocks do contexto e dos hooks
    useAuthValue.mockReturnValue({ user: fakeUser });
    useParams.mockReturnValue({ id: "1" });
    useFetchDocument.mockReturnValue({ document: fakePost });
    useUpdateDocument.mockReturnValue({ updateDocument: mockedUpdateDocument, response: {} });
    useNavigate.mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <EditPost />
      </BrowserRouter>
    );

  test("deve pré-preencher os campos do formulário com os dados do post", () => {
    renderComponent();

    // Verifica se os campos estão com os valores do post
    expect(screen.getByPlaceholderText(/Pense num bom título/i).value).toBe(fakePost.title);
    expect(screen.getByPlaceholderText(/Insira uma imagem que representa seu post/i).value).toBe(fakePost.image);
    expect(screen.getByPlaceholderText(/Insira o conteúdo do post/i).value).toBe(fakePost.body);
    // As tags são convertidas para string separada por vírgula e espaço
    expect(screen.getByPlaceholderText(/Insira as tags separadas por vírgula/i).value).toBe(fakePost.tags.join(", "));
  });

  test("deve chamar updateDocument com os dados atualizados ao submeter o formulário e redirecionar para /dashboard", async () => {
    renderComponent();

    // Atualiza os campos do formulário
    fireEvent.change(screen.getByPlaceholderText(/Pense num bom título/i), {
      target: { value: "Título Atualizado" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira uma imagem que representa seu post/i), {
      target: { value: "https://example.com/updated-image.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira o conteúdo do post/i), {
      target: { value: "Conteúdo atualizado" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Insira as tags separadas por vírgula/i), {
      target: { value: "novaTag1, novaTag2" },
    });

    // Clica no botão de "Editar"
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    await waitFor(() => {
      expect(mockedUpdateDocument).toHaveBeenCalledWith("1", {
        title: "Título Atualizado",
        image: "https://example.com/updated-image.jpg",
        body: "Conteúdo atualizado",
        tags: ["novaTag1", "novaTag2"],
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
