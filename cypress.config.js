import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    defaultCommandTimeout: 8000,
    baseUrl: "http://localhost:3000/",
    specPattern: ["**/e2e.cy.js", "**/changeSearchCategory.cy.js"]
  },
})