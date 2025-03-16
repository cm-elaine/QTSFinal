import '@testing-library/jest-dom';
import React from "react";

global.React = React;

// Mock do Firebase
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Simula um usuário não logado
      return jest.fn(); // ✅ Agora sempre retorna uma função válida
    }),
  })),
}));

// ✅ Mock correto do `useAuthentication`
jest.mock("./src/hooks/useAuthentication", () => ({
  useAuthentication: () => ({
    auth: {
      onAuthStateChanged: jest.fn((callback) => {
        callback(null); // Simula usuário não autenticado
        return jest.fn(); // Retorna uma função mockada como `unsubscribe`
      }),
    },
  }),
}));
