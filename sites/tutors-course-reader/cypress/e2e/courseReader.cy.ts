/// <reference types="cypress" />

describe("Initial quick tests", () => {
    beforeEach(() => {
    cy.intercept("**/topic-00-overview/unit-1/paneltalk-agenda/full-stack-overview.pdf").as("getPDF");
    cy.visit("/");
    });

    it("Ensure page displays with expected options & links", () => {
    
        cy.get('.app-bar').children().should('have.length', 3)
        
        cy.get(".ml-4").contains("Advanced Full Stack Web Development")

        cy.contains('[data-testid="drawer"]').should("not.exist");
        cy.get('[class="btn btn-sm"]').first().click();
        cy.get('[data-testid="drawer"]').should("be.visible")
        cy.contains(/x/i).should("be.visible");
        cy.get('[class="mt-4 mr-4 text-right"]').findByRole("button", { name: /x/i }).click();

        // Search
        cy.get('[class="btn btn-sm"]').eq(1).click()
        cy.get(".app-bar-trail a")
            .should("have.attr", "href")
            .should("include", "/#/search/full-stack-web-dev-oth-2022.netlify.app");

        //navigate back one level using bredcrumb ui 
        cy.contains('[data-testid="breadcrumb"]', 'Advanced Full S...').click()

        // Toggles Menu Check
        cy.get('[class="btn btn-sm"]').eq(2).click()

        // Theme Change
        cy.get("nav").should("be.visible");
        cy.get('nav').find('p.text-lg').eq(0).should('have.text', 'Dark Mode')
        cy.get('nav').find('p.text-lg').eq(1).should('have.text', 'Compact')
        cy.get('nav').find('p.text-lg').eq(2).should('have.text', 'Tutors')
        cy.get('nav').find('p.text-lg').eq(3).should('have.text', 'Dyslexia')

        // Switch to dark mode
        cy.get('nav').find('p.text-lg').eq(0).should('have.text', 'Dark Mode').click()

        // Check font after selecting 'tutors-dyslexia' theme
        cy.get('nav').find('p.text-lg').eq(3).should('have.text', 'Dyslexia').click();
        cy.get('.option:nth-child(2)')
            .should("have.css", "font-family", "OpenDyslexic, sans-serif");

        // Change back
        cy.get('nav').find('p.text-lg').eq(2).should('have.text', 'Tutors').click();
        cy.get('.option:nth-child(1)')
            .should("have.css", "font-family", 'Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"')

        // Switch layout
        cy.get('[class="flex justify-between"]')
            .findByRole('switch', { name: /light switch/i }).click()
        cy.get('[class="flex justify-between"]')
            .findByRole('switch', { name: /light switch/i }).click();
        
        // Assert CSS (reg/compact) width attr of topic card
        cy.get('div a:nth-child(1) > div')
            .should('be.visible')
            .should("have.class", "w-60");
        cy.get('div a:nth-child(2) > div')
            .should('be.visible')
            .should("have.class", "w-60");

        cy.get('[class="flex justify-between"]').eq(1).click()
        cy.get('div a:nth-child(1) > div').should("have.class", "w-36");
        cy.get('div a:nth-child(1) > div').should("not.have.class", "w-60");


        // href links for all topics
        const topicListLinks = [
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-00-overview",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-00-xassignments",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-01-node",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-02-hapi",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-03-joi",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-04-tdd",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-05-models",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-06-apis",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-07-rest",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-08-openapi",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-09-jwt",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-10-seeding",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-11-deployment",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-12-dom",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-13-svelte-intro",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-14-svelte-components",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-15-svelte-routing",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-16-svelte-applications",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-17-svelte-maps",
            "/#/topic/full-stack-web-dev-oth-2022.netlify.app//topic-18-svelte-full-stack",
        ];
        // checks the "href" value against each card
        cy.get('[class="flex flex-wrap justify-center"] a').each((item, index, list) => {
            expect(list).to.have.length(20); //true
            // assert each topic link matches
            cy.wrap(item)
                .should('have.attr', 'href')
                .and('equal', topicListLinks[index]);
        })

        // Content button
        cy.contains('[data-testid="drawer"]').should("not.exist");
        cy.get('[class="btn btn-sm"]').eq(3).click()
        cy.get('[data-testid="drawer"]').should("be.visible")
        cy.get(".mt-4 > .btn").should("be.visible").click();
        cy.contains('[data-testid="drawer"]').should("not.exist");
    });

      it("Check for first card and image loading", () => {
        cy.findByRole("link", { name: /module introduction/i });
        cy.get('[data-testid="avatar"]').eq(0)
            .should("be.visible")

        cy.get('[data-testid="avatar"] > img')
            .should("have.attr", "src")
            .should("include", "topic-00-overview/topic.png");
    });

    it("Check module intro overview details", () => {
        cy.findByRole("link", { name: /module introduction/i }).click();
        cy.findByRole("heading", { name: /^overview$/i, level: 2 });
        cy.get("iframe").should("have.attr", "src").should("eq", "https://www.youtube.com/embed/ChtFuaZ5WkA");
        cy.get('.card-corner .flex-wrap').eq(1).contains(/introducing the advanced full stack web development module/i);
        cy.findByRole('link', { name: /course webs course webs course · topic · video · slides · lab/i })
        cy.findByRole("heading", { name: /^course overview$/i, level: 2 });
        cy.wait("@getPDF");

        // check 'Prev Slide' button is visible
        cy.get('div.flex.flex-wrap.justify-center > div > div > div:nth-child(2) > button:nth-child(1)').scrollIntoView().should("be.visible");
        // check 'Next Slide' button is visible
        cy.get('div.flex.flex-wrap.justify-center > div > div > div:nth-child(2) > button:nth-child(2)').should("be.visible");
        // check 'Rotate 90 Degrees' button is visible
        cy.get('div.flex.flex-wrap.justify-center > div > div > div:nth-child(2) > button:nth-child(3)').should("be.visible");
        // check 'Download' button is visible
        cy.get('div.flex.flex-wrap.justify-center > div > div > div:nth-child(2) > button:nth-child(4)').should("be.visible");
        // check 'Full Screen' button is visible
        cy.get('div.flex.flex-wrap.justify-center > div > div > div:nth-child(2) > button:nth-child(5)').should("be.visible");
      });
});
