describe("Teste do Blog", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000"); // Abre a página inicial do blog
    });
  
    it("Deve carregar a página inicial corretamente", () => {
      cy.contains("Carregando...").should("not.exist"); // Aguarda a página carregar completamente
      cy.get("nav").should("be.visible"); // Verifica se a navbar está presente
    });
  
    it("Deve exibir pelo menos um post na Home", () => {
      cy.get(".post-title").should("have.length.greaterThan", 0); // Garante que há posts visíveis
    });
  
    it("Deve permitir clicar em um post e abrir a página de detalhes", () => {
      cy.get(".post-title").first().click(); // Clica no primeiro post encontrado
      cy.url().should("include", "/posts/"); // Verifica se a URL mudou corretamente
      cy.get(".post-content").should("be.visible"); // Verifica se o conteúdo do post aparece
    });
  
    it("Deve carregar a página Sobre corretamente", () => {
      cy.get("nav").contains("Sobre").click(); // Clica no link 'Sobre' na navbar
      cy.url().should("include", "/about"); // Confirma que a URL mudou corretamente
      cy.contains("Sobre o Blog").should("be.visible"); // Verifica se a página 'Sobre' carregou
    });
  
    it("Deve exibir o botão de login se o usuário não estiver autenticado", () => {
      cy.get("nav").contains("Login").should("be.visible"); // Verifica se o botão de login aparece
    });
  });
  