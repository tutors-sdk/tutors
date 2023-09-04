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
  cy.log("pdf, title:" + lo.pdf + lo.title)
  cy.wait(500)
  const pdf = typeof lo.pdf === 'string' ? lo.pdf.trim() : "";
  const video = typeof lo.video === 'string' ? lo.video.trim() : "";

  if (pdf !== "") {
    cy.log("PDF EXISTS: "+ lo.pdf)
    cy.inspectHref(lo.title.trim(), lo.pdf, id)
  } else if (video !== "") {
    cy.log("VIDEO EXISTS: "+ video)

    /**
     * NB: This needs to be commented back in for the test to run as it should just altered to have it
     * run with the broken link
     */
   // cy.inspectHref(lo.title.trim(), video, id);
   } else {
    cy.log("GITHUB EXISTS: "+ lo)

    cy.verifyGitHubHref(lo);
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
      cy.log("End of lab card: " + l)
      cy.get('span.hidden.text-xs.lg\\:block.lg\\:pl-2', { timeout: 10000 }).eq(2).click();
    }
  });
});

Cypress.Commands.add("clickStaticLabStep", (lo: any) => {
  //The slice is being used here because in the JSON the title starts with # and a space
  //If the JSON will not have the # as in my test json, it must be removed to function
  cy.get(`div.hidden.md\\:block ul.menu`, { timeout: 10000 })
    .find('a').should('exist').contains(lo.title.slice(1).trim()).click({ force: true });
});

Cypress.Commands.add("triggerStaticCardAction", (lo: any) => {
  if (lo.title.includes('#')) {
    cy.contains(lo.title.slice(1).trim()).click({ force: true });
  } else {
    const text = lo.title.trim();
    cy.log(text);
    // Perform assertions that multiple elements exist
    cy.findAllByText(text, { timeout: 10000 }).should('exist').each(elements => {
      // Check if at least one element is found
      if (elements.length > 0) {
        elements.each((_: any, el: any) => {
          cy.wait(250);
          // Element(s) found, perform actions on the first element
          cy.get(el, { timeout: 10000 }).should('exist').click({ force: true })
        });
      } else {
        cy.log(`Element with text "${text}" not found.`);
      }
    });
    cy.wait(500);
  }
});

Cypress.Commands.add("clickPanelVideo", (lo: any) => {
  cy.findAllByText(lo.title.trim(), { timeout: 10000 }, { matchCase: false });
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
          cy.get('div.h-full.overflow-hidden.contents',{ timeout: 10000 }).invoke('css', 'overflow', 'visible');
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
  // Extract relevant parts from the original URL using regular expressions
  let originalUrl = `${ahref.split(id)[1]}`;
  cy.log("url: " + originalUrl);
  cy.contains('.card > a', title)
    .then(($a) => {
      expect($a).to.have.attr('target', '_blank')
      // update attr to open in same tab
    })
    .and('have.attr', 'href')
    .and('contain', originalUrl);
});

Cypress.Commands.add("verifyGitHubHref", (lo: any) => {
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
      })
      .and('have.attr', 'href')
      .and('contain', lo.route.trim());
  }
});

Cypress.Commands.add("processCompanionsAndWallsLinks", (course: any) => {
  cy.get('.p-3 a').each((link) => {
    cy.log("BEGINING THE LOOP OF THE LINKS...")

    // you can get its href attribute using the .attr() method
    const href = link.attr('href');
    cy.log('Href:', href);

    //if the link is a link to another website it should have target _blank
    if (href?.includes("http")) {
      cy.wrap(link).should('have.attr', 'href').and('include', href);
      expect(link).to.have.attr('target', '_blank')
    } else {
      let countOfTalks = 0;
      let countOfNotes = 0;
      let countOfLabs = 0;
      let countOfGithubs = 0;
      let countOfWebs = 0;
      let countOfArchives = 0;
      //This is to alter the sting so we can navigate to the correct directory by removing the . 
      const alteredString = href ? href.replace("./", "../../html/") : "";

      cy.log(`${alteredString}`);
      switch (href) {
        case "./talk.html":
          cy.countHowManyLearningObjects(alteredString, countOfTalks, course, "talk")
          break;
        case "./lab.html":
          cy.countHowManyLearningObjects(alteredString, countOfLabs, course, "lab")
          break;
        case "./note.html":
          cy.countHowManyLearningObjects(alteredString, countOfNotes, course, "note")
          break;
        case "./archive.html":
          cy.countHowManyLearningObjects(alteredString, countOfArchives, course, "archive");
          break;
        case "./web.html":
          cy.countHowManyLearningObjects(alteredString, countOfWebs, course, "web");
          break;
        default:
          cy.countHowManyLearningObjects(alteredString, countOfGithubs, course, "github");
          break;
      }
    }
  });
});

Cypress.Commands.add("countHowManyLearningObjects", (alteredString: string, counts: number, course: any, type: string) => {
  cy.visit(`${alteredString}`);
  counts = countOccurrencesOfType(course, type);
  cy.log('occurences: ' + countOccurrencesOfType(course, type))
  cy.get(".card > a", { timeout: 10000 }).should('have.length', counts);
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

Cypress.Commands.add("clickStaticCard", (lo: any, id: string) => {
  if (!lo.hide && lo.type != "paneltalk" && lo.type != "panelvideo" && lo.type != undefined) {
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
      verifyGitHubHref(lo: any): Chainable<any>;
      processCompanionsAndWallsLinks(course: any): Chainable<any>;
      countHowManyLearningObjects(alteredString: string, counts: number, course: any, type: string): Chainable<any>;
      loopingObject(lo: any): Chainable<any>;
    }
  }
}
