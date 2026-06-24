const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev', // URL principal da nossa API
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});