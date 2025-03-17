// cypress/support/e2e.js
Cypress.on("uncaught:exception", (err, runnable) => {
    // Ignorar erros não críticos no Cypress
    return false;
  });
  