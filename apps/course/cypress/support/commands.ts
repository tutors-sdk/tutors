import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";
import "cypress-axe";
import "cypress-fail-fast";

/// <reference types="cypress" />

const delay = 1000;

Cypress.Commands.add("goBack", () => {
  cy.go("back");
  cy.wait(delay);
});

Cypress.Commands.add("clickBreadCrumb", (step: number) => {
  cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
  // Now you can interact with the <li> elements
  cy.get('li.crumb').eq(step).click();
  cy.wait(delay);
});

Cypress.Commands.add("clickCard", (lo: any) => {
  if (!lo.hide && lo.type != "web" && lo.type != "archive" && lo.type != "paneltalk" && lo.type != "github" && lo.type != "unit") {
    if (lo.type == "lab") {
      cy.clickLabCard(lo)
    } else {
      cy.triggerCardAction(lo);
    }
    cy.wait(delay);
  }
});

Cypress.Commands.add("clickLabStep", (lo: any) => {
  //The slice is being used here because in the JSON the title starts with # and a space
  //If the JSON will not have the # as in my test json, it must be removed to function
  cy.contains(`nav.nav-list ul a`, lo.title.slice(2).trim()).click({ force: true });
});

Cypress.Commands.add("triggerCardAction", (lo: any) => {
  cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
  if (lo.title.includes('#')) {
    // Do something if text contains 'desired-text'
    cy.contains(lo.title.slice(2).trim()).click({ force: true });
  } else {
    const text = lo.title.trim(); // Get and trim the text content
    cy.findByText(text)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }
});

Cypress.Commands.add("clickLabCard", (lo: any) => {
  cy.contains(lo.title.trim()).click({ force: true });
  lo.los.forEach((l, i) => {
    cy.clickLabStep(l)
    if (lo.los.length - 1 === i) {
      // Temporarily modify CSS to make the parent container visible
      cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
      // Now you can interact with the <li> elements
      cy.get('li.crumb').eq(2).click();
    }
  });
});

Cypress.Commands.add("toggleTOCWithVerification", (contents: any) => {
  //locates the Table of Contents button in the top right
  cy.get('button.btn.btn-sm', { timeout: 5000 }).eq(2).click("topRight", { force: true })
  //loops through the titles to verify that each title is shown on screen as should
  contents.forEach(element => {
    if(element.title != " Hidden\r"){
      cy.log(element.title)
      cy.get('div.drawer-backdrop')
        .find('div.drawer')
        .should('include.text', element.title);
    }
  });
});

Cypress.Commands.add("toggleInfoWithVerification", (contents: any) => {
  //locates the info button button in the top left
  cy.get('button.btn.btn-sm', { timeout: 5000 }).eq(0).click("topLeft", { force: true })
  //loops through the array of title and summary to verify that each title is shown on screen as should
  contents.forEach(element => {
      cy.log(element)
      cy.get('div.drawer-backdrop')
        .find('div.drawer')
        .should('include.text', element);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      goBack(): Chainable<any>;
      clickBreadCrumb(step: number): Chainable<any>;
      clickCard(lo: any): Chainable<any>;
      clickLabStep(lo: any): Chainable<any>;
      clickLabCard(lo: any): Chainable<any>;
      triggerCardAction(lo: any): Chainable<any>;
      toggleTOCWithVerification(contents: any): Chainable<any>;
      toggleInfoWithVerification(contents: any): Chainable<any>

    }
  }
}
