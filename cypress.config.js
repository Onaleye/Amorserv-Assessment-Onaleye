const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com/',
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 120000,  // Increased to 120 seconds for CI/CD
    responseTimeout: 60000,    // Add response timeout
    requestTimeout: 60000,     // Add request timeout
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

