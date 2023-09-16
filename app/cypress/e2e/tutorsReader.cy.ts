/// <reference types="cypress" />

let course: any = null;

describe("Tutors Reader: Loading the JSON fixture", function () {
  before(function () {
    //passing through the tutors json to be ingested and iterate over each objetc and assign out to c
    cy.fixture("tutors.json").then((c: any) => {
      course = c;
    });
  });

  beforeEach("Check: Define the dimensions of the screen being used", function () {
    cy.visit(`${Cypress.config().baseUrl}/course/tutors-cypress-testing`);
  });

  /**
   * This test case is checking that the headers and summary are present on all the
   * cards. You would expect all to match as it is coming from the JSON fixture
   */
  it("Course Reference page", function () {
    cy.get(".app-bar", { timeout: 30000 }).contains(course.title.trim());
    cy.get(".z-10").contains(course.title.trim());
    course.los.forEach((topic: any) => {
      if (!topic.hide) {
        cy.get(".card").contains(topic.title.trim());
        //cy.get(".card-footer").should('include.text', topic.summary.trim());
      }
    });
    cy.get('[class="btn btn-sm"]').should("exist");
    cy.contains('[data-testid="drawer"]').should("not.exist");
  });

  it("Test for Info Bar in top left", function () {
    let contents = [course.title.trim(), course.summary.trim()];
    cy.toggleInfoWithVerification(contents);
  });

  it("Test for the TOC in top right", function () {
    cy.toggleTOCWithVerification(course.los);
  });

  it("Verification of Companions & Walls hrefs and Counts", function () {
    cy.processCompanionsAndWallsLinks(course);
  });

  it("Testing search feature", function () {
    cy.partialSearchVerification(course.los);
  });

  it("Topics", function () {
    course.los.forEach((topic: any) => {
      if (!topic.hide) {
        console.log(topic);
        cy.clickCard(topic);
      }
      cy.get("div.h-full.overflow-hidden.contents").invoke("css", "overflow", "visible");
      cy.get("li.crumb").eq(0).click();
    });
  });

  it("Deep Topics", function () {
    course.los.forEach((topic: any) => {
      if (!topic.hide) {
        cy.wait(500);
        cy.clickCard(topic);
        topic.los.forEach((lo: any) => {
          cy.clickCard(lo);
          const los = typeof lo.los === "object" ? lo.los : "";
          if (los !== "") {
            lo.los.forEach((l: any) => {
              cy.clickCard(l);
            });
          }
          cy.get("div.h-full.overflow-hidden.contents").invoke("css", "overflow", "visible");
          cy.get("li.crumb").eq(1).click();
        });
        cy.get("div.h-full.overflow-hidden.contents").invoke("css", "overflow", "visible");
        cy.get("li.crumb").eq(0).click();
      }
    });
  });

  it("Verify the folder downloaded", () => {
    cy.verifyDownload("archive.zip", { timeout: 2500 });
  });
});
