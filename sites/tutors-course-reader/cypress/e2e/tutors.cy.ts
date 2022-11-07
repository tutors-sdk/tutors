/// <reference types="cypress" />

let course: any = null;

describe("User page", () => {
  before(function () {
    cy.fixture("tutors.json").then((c: any) => {
      course = c;
    });
  });

  beforeEach(function () {
    cy.viewport(1440, 1440);
    cy.visit("https://next.tutors.dev/#/course/tutors-template.netlify.app");
  });

  it("Topics", function () {
    course.los.forEach((topic) => {
      if (!topic.hide) {
        cy.clickCard(topic);
        cy.wait(500);
        cy.go("back");
        cy.wait(500);
      }
    });
  });

  it("Deep Topics", function () {
    course.los.forEach((topic) => {
      if (!topic.hide) {
        cy.clickCard(topic);
        topic.los.forEach((lo) => {
          cy.clickCard(lo);
          cy.go("back");
        });
        cy.go("back");
      }
    });
  });
});
