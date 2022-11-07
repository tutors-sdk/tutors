/// <reference types="cypress" />

describe("Initial quick tests", () => {
  beforeEach(() => {
    cy.intercept("**/topic-00-overview/unit-1/paneltalk-agenda/full-stack-overview.pdf").as("getPDF");
    cy.visit("/");
  });

  it("Ensure page displays with expected options & links", () => {
    cy.get(".navbar-title").contains("Advanced Full Stack Web Development");

    cy.contains(/course information/i).should("not.exist");
    cy.get('div[data-tip="Information"]').click();
    cy.contains(/course information/i).should("be.visible");
    cy.findByRole("button", { name: /close panel/i }).click();

    // Search
    cy.get(".header-icons-desktop > button.tooltip > .tooltip > .navbar-icon > a")
      .should("have.attr", "href")
      .should("include", "/#/search/full-stack-web-dev-oth-2022.netlify.app");

    // Switch layout
    cy.get(".flex-wrap > :nth-child(1)").should("have.class", "w-60");
    cy.get(".header-icons-desktop > :nth-child(2) > .tooltip > .navbar-icon").click();
    cy.get(".flex-wrap > :nth-child(1)").should("have.class", "w-32");
    cy.get(".flex-wrap > :nth-child(1)").should("not.have.class", "w-60");

    // Theme change
    cy.get('.header-icons-desktop > .dropdown-end > [data-tip=""] > .navbar-icon').realHover();
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(1)").should("have.text", "tutors");
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(2)").should("have.text", "tutors-dark");
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(3)").should("have.text", "tutors-black");
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(4)").should("have.text", "tutors-dyslexia");
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(5)").should("have.text", "tutors-wireframe");

    // Check font after selecting 'tutors-dyslexia' theme
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(4)").should("have.text", "tutors-dyslexia").click();
    cy.get(":nth-child(1) > a > .tutorscard-header-compact > .card-title").should("have.css", "font-family", "OpenDyslexic, sans-serif");

    // Change back
    cy.get('.header-icons-desktop > .dropdown-end > [data-tip=""] > .navbar-icon').realHover();
    cy.get(".header-icons-desktop > .dropdown-end > ul > :nth-child(1)").should("have.text", "tutors").click();
    cy.get(":nth-child(1) > a > .tutorscard-header-compact > .card-title").should("have.css", "font-family", "Inter, sans-serif");

    // Content button
    cy.contains(/course contents/i).should("not.exist");
    cy.get(".flex-0 > :nth-child(3) > .tooltip > .navbar-icon").click();
    cy.contains(/course contents/i).should("be.visible");
    cy.get(".ml-3 > .btn").should("be.visible").click();
    cy.contains(/course contents/i).should("not.exist");
  });

  it("Check for first card and image loading", () => {
    cy.findByRole("link", { name: /module introduction/i });
    cy.get(":nth-child(1) > a > .flex > .tutorscard-image")
      .should("be.visible")
      .and("have.prop", "naturalWidth")
      .should("be.greaterThan", 0);
    cy.get(":nth-child(1) > a > .flex > .tutorscard-image").should("have.attr", "src").should("include", "topic-00-overview/topic.png");
  });

  it("Check module intro overview details", () => {
    cy.findByRole("link", { name: /module introduction/i }).click();
    cy.findByRole("heading", { name: /^overview$/i, level: 2 });
    cy.get("iframe").should("have.attr", "src").should("eq", "https://www.youtube.com/embed/ChtFuaZ5WkA");

    cy.get(".carddeck-bg > .flex-wrap > :nth-child(1)").contains(/introducing the advanced full stack web development module/i);
    cy.get(".carddeck-bg > .flex-wrap > :nth-child(2)").contains("course · topic · video · slides · lab");

    cy.findByRole("heading", { name: /^course overview$/i, level: 2 });
    cy.wait("@getPDF");
    cy.get('div[data-tip="Previous Slide"]').scrollIntoView().should("be.visible");
    cy.get('div[data-tip="Next Slide"]').should("be.visible");
    cy.get('div[data-tip="Rotate 90 Degrees"]').should("be.visible");
    cy.get('div[data-tip="download"]').should("be.visible");
    cy.get('div[data-tip="Full Screen"]').should("be.visible");
    cy.get('[class="mx-auto w-full 2xl:w-4/5"]').should("be.visible");
  });
});
