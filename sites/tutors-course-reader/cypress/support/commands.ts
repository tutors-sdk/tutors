import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";
import "cypress-axe";
import "cypress-fail-fast";

/// <reference types="cypress" />

const delay = 1000;

Cypress.Commands.add("clickBreadcrumb", (lo: any) => {
  // cy.get(".crumb-lead").contains(lo.title.trim()).click();
  cy.go("back");
  cy.wait(delay);
});

Cypress.Commands.add("clickCard", (lo: any) => {
  if (!lo.hide && lo.type != "github" && lo.type != "archive" && lo.type != "web" && lo.type != "unit") {
    if (lo.type == "lab") {
      cy.contains(lo.title.trim()).click();
      for (let i = 1; i < 7; i++) cy.clickLabStep(i);
    } else {
      cy.contains(lo.title.trim()).click();
    }
    cy.wait(delay);
  }
});

Cypress.Commands.add("clickLabStep", (step: number) => {
  cy.get(`div.labmenu-container > ul > li:nth-child(${step}) > a`).click();
  cy.wait(delay);
});

declare global {
  namespace Cypress {
    interface Chainable {
      clickBreadcrumb(lo: any): Chainable<any>;
      clickCard(lo: any): Chainable<any>;
      clickLabStep(lo: any): Chainable<any>;
    }
  }
}
