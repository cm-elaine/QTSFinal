export const auth = {
    onAuthStateChanged: jest.fn((callback) => callback(null)),
  };
  export const firestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ title: "Mocked Post" }) })),
        set: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
    })),
  };
  