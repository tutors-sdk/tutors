import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";
import "cypress-axe";
import "cypress-fail-fast";
import { error } from "console";

/// <reference types="cypress" />

const delay = 1000;

Cypress.Commands.add("goBack", () => {
  cy.go("back");
  cy.wait(delay);
});

Cypress.Commands.add("clickBreadCrumb", (step: number) => {
  cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');
  // Now you can interact with the <li> elements
  cy.get('li.crumb', { timeout: 100000 }).eq(step).click({ force: true });
});

Cypress.Commands.add("clickCard", (lo: any) => {
  if (!lo.hide && lo.type != "paneltalk" && lo.type != undefined) {
    cy.log("Begining: " + lo.type)
    switch (lo.type) {
      case "lab":
        cy.clickLabCard(lo);
        break;
      case "step":
        cy.clickLabStep(lo);
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
        cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');
        cy.get('li.crumb').eq(1).click({ force: true });
        break;
      case "talk":
        cy.triggerCardAction(lo);
        cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');
        cy.get('li.crumb').eq(1).click({ force: true });
        break;
      default:
        cy.log("other");
        cy.triggerCardAction(lo);
    }
    cy.wait(250);
  }
});

Cypress.Commands.add("clickLabStep", (lo: any) => {
  //The slice is being used here because in the JSON the title starts with # and a space
  //If the JSON will not have the # as in my test json, it must be removed to function
  cy.get(`nav.nav-list ul a`, { timeout: 10000 }).contains(lo.title.slice(2).trim());

  cy.get(`nav.nav-list ul a`, { timeout: 10000 }).each((link) => {
    // you can get its href attribute using the .attr() method
    const href = link.attr('href');
    cy.log('Href:', href);
    //if the link is a link to another website it should have target _blank
    if (href.includes("http")) {
      cy.wrap(link).should('have.attr', 'href').and('include', href);
      expect(link).to.have.attr('target', '_blank')
    }
  })
});

Cypress.Commands.add("triggerCardAction", (lo: any) => {
  cy.wait(250);
  cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');

  if (lo.title.includes('#')) {
    cy.contains(lo.title.slice(1).trim()).click({ force: true });
  } else {
    const text = lo.title.trim();
    cy.log(text);
    cy.findByText(text, {timeout: 10000}).then(($element) => {
      // Perform actions on the found element if needed
      cy.wrap($element).should('exist');
      cy.wrap($element).click({ force: true })
    });
    cy.wait(500);
  }
});

Cypress.Commands.add("clickLabCard", (lo: any) => {
  // Temporarily modify CSS to make the parent container visible
  cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');

  cy.contains(lo.title.trim()).click({ force: true });
  lo.los.forEach((l: any, i: number) => {
    cy.clickLabStep(l)
    if (lo.los.length - 1 === i) {
      // Now you can interact with the <li> elements
      cy.get('li.crumb', { timeout: 10000 }).eq(2).click();
    }
  });
});

Cypress.Commands.add("toggleTOCWithVerification", (contents: any) => {
  //locates the Table of Contents button in the top right
  cy.get('button.btn.btn-sm', { timeout: 10000 }).eq(2).click("topRight", { force: true });
  //loops through the titles to verify that each title is shown on screen as should
  contents.forEach((element: any) => {
    if (element.title != " Hidden\r") {
      cy.log(element.title)
      cy.get('div.drawer-backdrop', { timeout: 10000 })
        .find('div.drawer')
        .should('include.text', element.title);
    }
  });
});

Cypress.Commands.add("toggleInfoWithVerification", (contents: any) => {
  //locates the info button button in the top left
  cy.get('button.btn.btn-sm', { timeout: 10000 }).eq(0).click("topLeft", { force: true });
  //loops through the array of title and summary to verify that each title is shown on screen as should
  contents.forEach((element: any) => {
    cy.log(element)
    cy.get('div.drawer-backdrop', { timeout: 10000 })
      .find('div.drawer')
      .should('include.text', element);
  });
});

Cypress.Commands.add("partialSearchVerification", (searchWord: string) => {
  const pattern = /lab/i; // Regular expression pattern with 'i' flag for case-insensitive matching
  let countOfMatches = 0;

  cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');
  cy.get('a.btn.btn-sm', { timeout: 10000 }).eq(0).click({ force: true });
  cy.get('input#search', { timeout: 10000 }).eq(0).type("lab");
  cy.get('div.pt-4.text-right.text-sm a', { timeout: 10000 })
    .each((link) => {
      //const links = els.toArray();
        let href = link.attr('href');
        cy.log('Href:', href);
        //if the link is a link to another website it should have target _blank
        cy.wrap(link).should('have.attr', 'href').and('include', href);
        expect(link).to.have.attr('target', '_blank')
        cy.wait(100);
    }).then((els) => {
      const links = els.toArray();

      links.forEach((el) =>{
        const found = el.innerText.match(pattern)
        if (found !== null) {
          cy.log(`${el} has been found`)
          countOfMatches++
        }

      });// extract texts
      cy.log(`${countOfMatches}`);
      if (countOfMatches === 0) {
        throw error
      }
    })
});

Cypress.Commands.add("verifyContentsExists", (lo: any) => {
  cy.log(lo.title)
  cy.get('.card', { timeout: 10000 }).should('include.text', lo.title.trim())
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

    cy.findAllByText(lo.title.trim(), { matchCase: false }).click({ force: true })
      .then(() => {
        cy.location().then((location) => {
          cy.request({
            method: 'GET',
            url: location.href,
            failOnStatusCode: false, // Allow non-2xx status codes
          }).then((response) => {
            expect(response.status).to.not.eq(404); // Assert that the status code is 404
          });
        });
        cy.log("after clicking archive card")
        cy.get('div.h-full.overflow-hidden.contents', { timeout: 10000 }).invoke('css', 'overflow', 'visible');
        // Now you can interact with the <li> elements
        cy.get('li.crumb', { timeout: 10000 }).eq(1).click({ force: true });
      });
  })
});

Cypress.Commands.add("processCompanionsAndWallsLinks", (course: any) => {
  cy.get('.my-2 a:not(:first)', { timeout: 10000 }).each((link) => {
    // you can get its href attribute using the .attr() method
    const href = link.attr('href');
    cy.log('Href:', href);
    //if the link is a link to another website it should have target _blank
    if (href.includes("http")) {
      cy.wrap(link).should('have.attr', 'href').and('include', href);
      expect(link).to.have.attr('target', '_blank')
    } else {
      let countOfTalks = 0;
      let countOfNotes = 0;
      let countOfLabs = 0;
      let countOfGithubs = 0;
      let countOfWebs = 0;
      let countOfArchives = 0;
      let countOfVideos = 0;

      const parts = href ? href.split('/') : ""; // Split the URL string into an array using "/"
      const alteredString = parts[2]; // Remove the last element from the array and get "video"

      cy.log(`Altered string: ${alteredString}`); // Output: The type 
      cy.log(`${alteredString}`);
      switch (alteredString) {
        case "talk":
          cy.log("talk")
          cy.countHowManyLearningObjects(`${href}`, countOfTalks, course, "talk")
          break;
        case "lab":
          cy.log("lab")
          cy.countHowManyLearningObjects(`${href}`, countOfLabs, course, "lab")
          break;
        case "note":
          cy.countHowManyLearningObjects(`${href}`, countOfNotes, course, "note")
          break;
        case "archive":
          cy.countHowManyLearningObjects(`${href}`, countOfArchives, course, "archive");
          break;
        case "web":
          cy.countHowManyLearningObjects(`${href}`, countOfWebs, course, "web");
          break;
        case "github":
          cy.countHowManyLearningObjects(`${href}`, countOfGithubs, course, "github");
          break;
        case "video":
          cy.countHowManyLearningObjects(`${href}`, countOfVideos, course, "video");
          break;
        default:
          cy.log("The type does not match any existing types...")
          break;
      }
    }
  });
});

Cypress.Commands.add("countHowManyLearningObjects", (href: string, counts: number, course: any, type: string) => {
  cy.visit(`${href}`);
  cy.wait(delay);
  cy.log(course);
  counts = countOccurrencesOfType(course, type);
  cy.log('occurences: ' + countOccurrencesOfType(course, type))
  cy.get('.card.m-2', { timeout: 10000 }).should('have.length', counts);
});

function countOccurrencesOfType(obj: any, type: string) {
  let count = 0;

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      count += countOccurrencesOfType(obj[key], type);
    } else if (key === "type" && obj[key] === type) {
      count++;
    }
  }
  return count;
}

declare global {
  namespace Cypress {
    interface Chainable {
      goBack(): Chainable<any>;
      clickCard(lo: any): Chainable<any>;
      clickLabStep(lo: any): Chainable<any>;
      clickLabCard(lo: any): Chainable<any>;
      verifyCompanionHrefs(): Chainable<any>;
      clickPanelVideo(lo: any): Chainable<any>;
      triggerCardAction(lo: any): Chainable<any>;
      verifyContentsExists(lo: any): Chainable<any>;
      partialSearchVerification(lo: any): Chainable<any>;
      verifyDownloadOfArchive(lo: any): Chainable<any>;
      clickLinkWithExactText(text: string): Chainable<any>;
      toggleTOCWithVerification(contents: any): Chainable<any>;
      toggleInfoWithVerification(contents: any): Chainable<any>;
      processCompanionsAndWallsLinks(course: any): Chainable<any>;
      countHowManyLearningObjects(alteredString: string, counts: number, course: any, type: string): Chainable<any>;
    }
  }
}
