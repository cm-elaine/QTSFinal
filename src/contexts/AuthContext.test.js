import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuthValue } from "./AuthContext";

// Componente dummy que usa o hook useAuthValue
const DummyComponent = () => {
  const auth = useAuthValue();
  return <div data-testid="auth-value">{JSON.stringify(auth)}</div>;
};

describe("AuthContext", () => {
  test("deve repassar o valor fornecido para seus consumidores", () => {
    const fakeValue = { user: { uid: "123", displayName: "Test User" } };
    
    render(
      <AuthProvider value={fakeValue}>
        <DummyComponent />
      </AuthProvider>
    );
    
    const authDiv = screen.getByTestId("auth-value");
    expect(authDiv).toHaveTextContent(JSON.stringify(fakeValue));
  });
});
