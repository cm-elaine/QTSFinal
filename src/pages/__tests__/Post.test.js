import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Post from "../Post/Post"; // Verifique se o caminho está correto

// Mock do hook useFetchDocument
import { useFetchDocument } from "../../hooks/useFetchDocument";
jest.mock("../../hooks/useFetchDocument", () => ({
  useFetchDocument: jest.fn(),
}));

describe("Post Page", () => {
  test("deve renderizar os detalhes do post quando o post existe", () => {
    // Cria um post falso
    const fakePost = {
      id: "1",
      title: "Test Title",
      image: "http://example.com/image.jpg",
      body: "Test body",
      tags: ["tag1", "tag2"],
    };

    // Faz o hook retornar o post falso
    useFetchDocument.mockReturnValue({ document: fakePost });

    // Renderiza o componente Post dentro de um MemoryRouter para simular a rota
    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<Post />} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica se os detalhes do post são renderizados
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Test Title/i)).toHaveAttribute(
      "src",
      "http://example.com/image.jpg"
    );
    expect(screen.getByText(/Test body/i)).toBeInTheDocument();
    expect(screen.getByText(/Este post trata sobre/i)).toBeInTheDocument();

    // Verifica as tags individualmente
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });
});
