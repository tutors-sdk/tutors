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
    cy.visit("https://reader.tutors.dev/#/course/tutors-template.netlify.app");
  });

  it("Topics", function () {
    course.los.forEach((topic) => {
      cy.clickCard(topic);
      cy.clickBreadcrumb(course);
    });
  });

  it("Deep Topics", function () {
    course.los.forEach((topic) => {
      if (!topic.hide) {
        cy.clickCard(topic);
        topic.los.forEach((lo) => {
          cy.clickCard(lo);
          cy.clickBreadcrumb(topic);
        });
        cy.clickBreadcrumb(course);
      }
    });
  });
});
