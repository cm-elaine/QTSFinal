import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "../useQuery";

// Componente de teste que exibe o valor de "q" na tela
function TestQueryComponent() {
  const query = useQuery();
  const qValue = query.get("q");

  return <div data-testid="q-param">Valor de q: {qValue}</div>;
}

describe("useQuery hook", () => {
  test("deve retornar o valor do parâmetro 'q' a partir da URL", () => {
    render(
      <MemoryRouter initialEntries={["/fake?q=teste"]}>
        <Routes>
          {/* Rota simples que carrega nosso componente de teste */}
          <Route path="/fake" element={<TestQueryComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica se o hook pegou "teste" do query param "q"
    expect(screen.getByTestId("q-param")).toHaveTextContent("teste");
  });

  test("deve retornar null se o parâmetro não existir", () => {
    render(
      <MemoryRouter initialEntries={["/fake"]}>
        <Routes>
          <Route path="/fake" element={<TestQueryComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Se não há 'q' na URL, get("q") retorna null
    expect(screen.getByTestId("q-param")).toHaveTextContent("Valor de q:");
  });
});
