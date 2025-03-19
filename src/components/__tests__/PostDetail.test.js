import React from "react";
import { render, screen } from "@testing-library/react";
import PostDetail from "../PostDetail";

describe("PostDetail", () => {
  const fakePost = {
    id: "1",
    image: "https://example.com/image.jpg",
    title: "Test Post",
    createdBy: "Test Author",
    tags: ["tag1", "tag2"],
  };

  test("deve renderizar os detalhes do post corretamente", () => {
    render(<PostDetail post={fakePost} />);

    // Verifica se a imagem é renderizada com o alt e src corretos
    const image = screen.getByAltText(/Test Post/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", fakePost.image);

    // Verifica se o título é renderizado
    expect(screen.getByText(/Test Post/i)).toBeInTheDocument();

    // Verifica se o autor é renderizado
    expect(screen.getByText(/Autor: Test Author/i)).toBeInTheDocument();

    // Verifica se as tags são renderizadas corretamente
    expect(screen.getByText(/Tags: tag1, tag2/i)).toBeInTheDocument();
  });
});
