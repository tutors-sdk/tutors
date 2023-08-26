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
  cy.get('li.crumb', {timeout: 10000}).eq(step).click({ force: true });
});

Cypress.Commands.add("clickCard", (lo: any) => {
  if (!lo.hide && lo.type != "paneltalk" && lo.type != undefined ) {
    cy.log("Begining: " +lo.type)
    switch (lo.type) {
      case "lab":
        cy.clickLabCard(lo)
        break;
      case "step":
        cy.clickLabStep(lo)
        break;
      case "unit":
        cy.clickPanelVideo(lo);
        break;
      case "github":
        cy.verifyContentsExists(lo);
        break;
      case "archive":
        cy.verifyDownloadOfArchive(lo);
        break;
      case "web":
        cy.verifyContentsExists(lo);
        break;
      case "note":
        cy.triggerCardAction(lo);
        //cy.wait(250);
        cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
        cy.get('li.crumb',{timeout:10000}).eq(1).click();
        break;
      case "talk":
        cy.triggerCardAction(lo);
        //cy.wait(250);
        cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
        cy.get('li.crumb',{timeout:10000}).eq(1).click();
        break;
      default:
        cy.triggerCardAction(lo);
    }
    cy.wait(250);
  }
});

Cypress.Commands.add("clickLabStep", (lo: any) => {
  //The slice is being used here because in the JSON the title starts with # and a space
  //If the JSON will not have the # as in my test json, it must be removed to function
  cy.get(`nav.nav-list ul a`).contains(lo.title.slice(2).trim()).click({ force: true });
});

Cypress.Commands.add("triggerCardAction", (lo: any) => {
  cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');

  if (lo.title.includes('#')) {
    cy.contains(lo.title.slice(1).trim()).click({ force: true });
  } else {
    const text = lo.title.trim();
    cy.log(text);
    // Perform assertions that multiple elements exist
    cy.findAllByText(text, {timeout: 10000}).should('exist').each($elements => {
      // Check if at least one element is found
      if ($elements.length > 0) {
        $elements.each((_, $el) => {
          cy.log("INSIDE CARD: " + $el)
          // Element(s) found, perform actions on the first element
          cy.wrap($el).click({ force: true });
        });
      } else {
        cy.log(`Element with text "${text}" not found.`);
      }
    });
    cy.wait(500);
  }
});

Cypress.Commands.add("clickLabCard", (lo: any) => {
  // Temporarily modify CSS to make the parent container visible
  cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');

  cy.contains(lo.title.trim()).click();
  lo.los.forEach((l: any, i: number) => {
    cy.clickLabStep(l)
    if (lo.los.length - 1 === i) {
      // Now you can interact with the <li> elements
      cy.get('li.crumb').eq(2).click();
    }
  });
});

Cypress.Commands.add("toggleTOCWithVerification", (contents: any) => {
  //locates the Table of Contents button in the top right
  cy.get('button.btn.btn-sm', { timeout: 10000 }).eq(2).click("topRight", { force: true })
  //loops through the titles to verify that each title is shown on screen as should
  contents.forEach((element: any) => {
    if (element.title != " Hidden\r") {
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
  contents.forEach((element: any) => {
    cy.log(element)
    cy.get('div.drawer-backdrop')
      .find('div.drawer')
      .should('include.text', element);
  });
});

Cypress.Commands.add("verifyContentsExists", (lo: any) => {
  cy.log(lo.title)
  cy.get('.card').should('include.text', lo.title.trim())
    .should('exist');
});

Cypress.Commands.add("clickPanelVideo", (lo: any) => {
  cy.findAllByText(lo.title.trim(), { matchCase: false });
});

Cypress.Commands.add("verifyDownloadOfArchive", (lo: any) => {
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      // this adds a listener that reloads your page 
      // after 0.7 seconds from clicking the download button
      setTimeout(function () { doc.location.reload() }, 700)
    })

  cy.findAllByText(lo.title.trim(), { matchCase: false }).click({force:true})
  .then(() => {
    cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
    // Now you can interact with the <li> elements
    cy.get('li.crumb', {timeout: 10000}).eq(1).click({ force: true });  
  }); 
  })
});

Cypress.Commands.add("verifyCompanionHrefs", () => {
  cy.get('.my-2 a').each((link) => {
    // Now you can interact with each <a> element
    // you can get its href attribute using the .attr() method
    const href = link.attr('href');
    cy.log('Href:', href);
    //if the link is a link to another website it should have target _blank
    if(href.includes("http")){
      expect(link).to.have.attr('target', '_blank')
    }
    cy.wrap(link).should('have.attr', 'href').and('include', href)
  })
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
      verifyContentsExists(lo: any): Chainable<any>;
      clickPanelVideo(lo: any): Chainable<any>;
      verifyDownloadOfArchive(lo: any): Chainable<any>;
      clickLinkWithExactText(text: string): Chainable<any>;
      toggleTOCWithVerification(contents: any): Chainable<any>;
      toggleInfoWithVerification(contents: any): Chainable<any>;
      verifyCompanionHrefs(): Chainable<any>;
    }
  }
}
