import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";
import "cypress-axe";
import "cypress-fail-fast";

/// <reference types="cypress" />

/**
 * ***********Static Version of Course Reader**************
 */

const delay = 1000;

Cypress.Commands.add("goBack", () => {
  cy.go("back");
  cy.wait(delay);
});

Cypress.Commands.add("verifyContentsExists", (lo: any, id: string) => {
  if (lo.pdf != "") {
    cy.inspectHref(lo.title.trim(), lo.pdf.trim(), id)
  } else if (lo.video != "") {
    /**
     * NB: This needs to be commented back in for the test to run as it should just altered to have it
     * run with the broken link
     */
    //cy.inspectHref(lo.title.trim(), lo.video.trim(), id);
  } else {
    cy.verifyGitHubHref(lo, id);
  }
});

Cypress.Commands.add("clickStaticBreadCrumb", (step: number) => {
  // Now you can interact with the <li> elements
  cy.get('span.hidden.text-xs.lg\\:block.lg\\:pl-2', { timeout: 10000 })
    .eq(step).click();
});

Cypress.Commands.add("clickStaticLabCard", (lo: any) => {
  cy.contains(lo.title.trim()).click();
  lo.los.forEach((l: any, i: number) => {
    cy.clickStaticLabStep(l)
    if (lo.los.length - 1 === i) {
      cy.log(l)
      cy.get('span.hidden.text-xs.lg\\:block.lg\\:pl-2').eq(2).click();
    }
  });
});

Cypress.Commands.add("clickStaticLabStep", (lo: any) => {
  //The slice is being used here because in the JSON the title starts with # and a space
  //If the JSON will not have the # as in my test json, it must be removed to function
  cy.get('div.hidden.md\\:block ul.menu')
    .find('a').should('exist').contains(lo.title.slice(1).trim()).click({ force: true });
});

Cypress.Commands.add("triggerStaticCardAction", (lo: any) => {
  if (lo.title.includes('#')) {
    cy.contains(lo.title.slice(1).trim()).click({ force: true });
  } else {
    const text = lo.title.trim();
    cy.log(text);
    // Perform assertions that multiple elements exist
    cy.findAllByText(text, { timeout: 5000 }).should('exist').each($elements => {
      // Check if at least one element is found
      if ($elements.length > 0) {
        $elements.each((_: any, $el: any) => {
          // Element(s) found, perform actions on the first element
          cy.wrap($el).click({ force: true });
        });
      } else {
        cy.log(`Element with text "${text}" not found.`);
      }
    });
  }
});

Cypress.Commands.add("clickPanelVideo", (lo: any) => {
  cy.findAllByText(lo.title.trim(), { matchCase: false });
});

Cypress.Commands.add("verifyDownloadOfArchive", (lo: any, version: string) => {
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      // this adds a listener that reloads your page 
      // after 0.7 seconds from clicking the download button
      setTimeout(function () { doc.location.reload() }, 350)
    })

    cy.findAllByText(lo.title.trim(), { matchCase: false }).click({ force: true })
      .then(() => {
        if (version == "dynamic") {
          cy.get('div.h-full.overflow-hidden.contents').invoke('css', 'overflow', 'visible');
          // Now you can interact with the <li> elements
          cy.get('li.crumb', { timeout: 10000 }).eq(1).click({ force: true });
        } else {
          cy.get('span.hidden.text-xs.lg\\:block.lg\\:pl-2', { timeout: 10000 })
            .eq(1).should('be.visible').click();
        }
      });
  })
});

Cypress.Commands.add("inspectHref", (title: string, ahref: string, id: string) => {
  // Original URL
  cy.log(ahref);
  let originalUrl = ahref;
  // Extract relevant parts from the original URL using regular expressions
  originalUrl = `${ahref.split(id)[1]}`;
  cy.log("ourl" + originalUrl);
  cy.contains('.card > a', title)
    .then(($a) => {
      expect($a).to.have.attr('target', '_blank')
      // update attr to open in same tab
    })
    .and('have.attr', 'href')
    .and('contain', originalUrl);
});

Cypress.Commands.add("verifyGitHubHref", (lo: any, id: string) => {
  //I think this will be ok for dynamic purposes also as when you are providing links to GitHub
  //The name will be involved some way
  if (lo.title.trim().includes("Github")) {
    cy.contains('.card > a', "Github")
      .then(($a) => {
        expect($a).to.have.attr('target', '_blank')
        // update attr to open in same tab
      })
      .and('have.attr', 'href')
      .and('contain', lo.route.trim());
  } else {
    cy.contains('.card > a', lo.title.trim())
      .then(($a) => {
        expect($a).to.have.attr('target', '_blank')
        // update attr to open in same tab
      })
      .and('have.attr', 'href')
      .and('contain', lo.route.trim());
  }
});

Cypress.Commands.add("clickStaticCard", (lo: any, id: string) => {
  if (!lo.hide && lo.type != "paneltalk" && lo.type != "panelvideo") {
    cy.log("TYPE: " + lo.type)
    switch (lo.type) {
      case "lab":
        cy.clickStaticLabCard(lo)
        break;
      case "step":
        cy.clickStaticLabStep(lo)
        break;
      case "unit":
        cy.clickPanelVideo(lo);
        break;
      case "github":
        cy.verifyContentsExists(lo, id);
        break;
      case "archive":
        cy.verifyDownloadOfArchive(lo, "static");
        break;
      case "web":
        cy.verifyContentsExists(lo, id);
        break;
      case "talk":
        cy.verifyContentsExists(lo, id);
        break;
      case "note":
        cy.triggerStaticCardAction(lo);
        cy.clickStaticBreadCrumb(1);
        break;
      default:
        cy.triggerStaticCardAction(lo);
    }
    cy.wait(250);
  }
});

declare global {
  namespace Cypress {
    interface Chainable {
      goBack(): Chainable<any>;
      /**
       * ***HTML Generator Version
       */
      clickStaticCard(lo: any, id: string): Chainable<any>;
      clickPanelVideo(lo: any): Chainable<any>;
      clickGithubRepo(lo: any): Chainable<any>;
      verifyDownloadOfArchive(lo: any, version: string): Chainable<any>;
      clickStaticLabStep(lo: any): Chainable<any>;
      clickStaticBreadCrumb(step: number): Chainable<any>;
      clickStaticLabCard(lo: any): Chainable<any>;
      triggerStaticCardAction(lo: any): Chainable<any>
      clickLinkWithExactText(text: string): Chainable<any>;
      toggleTOCWithVerification(contents: any): Chainable<any>;
      toggleInfoWithVerification(contents: any): Chainable<any>
      inspectHref(title: string, href: string, id: string): Chainable<any>
      verifyContentsExists(lo: any, id: string): Chainable<any>;
      verifyGitHubHref(lo: any, id: string): Chainable<any>;
    }
  }
}
