const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Ajuste conforme necessário
    supportFile: false, // Isso remove a necessidade do arquivo de suporte
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
