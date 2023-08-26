/// <reference types="cypress" />

let course: any = null;

describe("Loading the JSON fixture", function () {
    before(function () {
        cy.exec(`npx tutors-publish-html`)
        //passing through the tutors json to be ingested and iterate over each objetc and assign out to c
        cy.fixture("../../html/tutors.json").then((c: any) => {
            course = c;
        });
    });

    beforeEach('Check: Define the dimensions of the screen being used', function () {
        cy.viewport(1440, 1440);
        cy.visit("../../html/index.html");

    });


    /**
    * This test case is checking that the headers and summary are present on all the
    * cards. You would expect all to match as it is coming from the JSON fixture
    */
    it('Course Reference page', function () {
        // Test case
        cy.wait(500);
        cy.get('.p-3.shadow-lg.bg-neutral.text-neutral-content.rounded-box.nav-corner.mb-1.justify-start.z-40.flex.mt-2').contains(course.title.trim());
        cy.wait(1000);
        cy.get('div.ml-4.flex-nowrap').should('include.text', course.title.trim());
        course.los.forEach((topic: any) => {
            if (!topic.hide) {
                cy.get('.card-title').should('include.text', topic.title.trim())

            }
        });
    });

    it("Topics", function () {
        course.los.forEach((topic: any) => {
            if (!topic.hide) {
                console.log(topic);
                cy.clickStaticCard(topic, topic.id.trim());
                cy.wait(500);
                cy.go("back");
                cy.wait(500);
            }
        });
    });

    it("Deep Topics", function () {
        course.los.forEach((topic: any) => {
            if (!topic.hide) {
                cy.visit("../../html/index.html");
                cy.wait(500);
                cy.clickStaticCard(topic, topic.id.trim());
                topic.los.forEach((lo: any) => {
                    cy.clickStaticCard(lo, topic.id.trim());
                    lo.los.forEach((l: any) => {
                        cy.clickStaticCard(l, topic.id.trim());
                    });
                    cy.clickStaticBreadCrumb(1)
                });
            }
        });
    });

    it('Verify the folder downloaded', () => {
        cy.verifyDownload('archive.zip', { timeout: 2500 });
    });
});