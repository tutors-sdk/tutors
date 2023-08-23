"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let course = null;
describe("Loading the JSON fixture", function () {
    before(function () {
        //passing through the tutors json to be ingested and iterate over each objetc and assign out to c
        cy.fixture("static-tutors.json").then((c) => {
            course = c;
        });
    });
    beforeEach('Check: Define the dimensions of the screen being used', function () {
        // This defines the dimensions of the screen
        cy.viewport(1440, 1440);
        cy.visit('../../..//tutors-reference-course/html');
        // Install http-server locally within the project
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
        course.los.forEach((topic) => {
            if (!topic.hide) {
                cy.get('.card-title').should('include.text', topic.title.trim());
            }
        });
    });
    it("Topics", function () {
        course.los.forEach((topic) => {
            if (!topic.hide) {
                console.log(topic);
                cy.clickStaticCard(topic);
                cy.wait(500);
                cy.go("back");
                cy.wait(500);
            }
        });
    });
    it("Deep Topics", function () {
        course.los.forEach((topic) => {
            if (!topic.hide) {
                cy.wait(500);
                cy.clickStaticCard(topic);
                topic.los.forEach((lo) => {
                    cy.clickStaticCard(lo);
                    lo.los.forEach((l) => {
                        cy.clickStaticCard(l);
                    });
                    cy.clickStaticBreadCrumb(1);
                });
                cy.clickStaticBreadCrumb(0);
            }
        });
    });
    it('Verify the folder downloaded', () => {
        cy.verifyDownload('archive.zip', { timeout: 2500 });
    });
});
//# sourceMappingURL=tutorsHtmlGenerator.cy.js.map