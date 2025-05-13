// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import { generateMockBook } from '../../test/utils/mocks';

beforeEach(() => {
    cy.viewport(1280, 1024);
    cy.visit("/");
    cy.fixture("testUser").as("testUserData");
    cy.intercept("GET", "/api/search?*", [generateMockBook(), generateMockBook(), generateMockBook()]);
  })

const resizeObserverLoopErrRe = /ResizeObserver loop completed with undelivered notifications/;
Cypress.on('uncaught:exception', (err) => {  
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});