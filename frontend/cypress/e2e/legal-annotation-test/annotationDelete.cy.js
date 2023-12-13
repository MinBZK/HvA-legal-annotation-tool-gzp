const API_BASE = 'http://localhost:8000/api/';

describe('Visit main page', () => {
    beforeEach(() => {
        // Define intercepts
        cy.intercept('GET', `${API_BASE}project/1`, {
            statusCode: 200,
            body: {
                id: 1,
                xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                selectedArticles: null
            },
        }).as('projectRequest');

        cy.intercept('GET', `${API_BASE}annotations/project/1`, {
            statusCode: 200,
            body: [{
                id: 15,
                selectedWord: "Lorem ipsum",
                text: "test",
                lawClass: {
                    id: 2,
                    name: "Rechtssubject",
                    color: "#c2e7ff"
                },
                project: {
                    id: 1,
                    xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    selectedArticles: null
                }
            },
            {
                id: 15,
                selectedWord: "Lorem ipsum",
                text: "test",
                lawClass: {
                    id: 2,
                    name: "Rechtssubject",
                    color: "#c2e7ff"
                },
                project: {
                    id: 1,
                    xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    selectedArticles: null
                }
            }],
        }).as('annotationProjectRequest');

        cy.intercept('GET', `${API_BASE}classes`, {
            statusCode: 200,
            body: [
                { id: 1, name: "Rechtbetrekking", color: "#70a4ff" },
                { id: 2, name: "Rechtssubject", color: "#c2e7ff" },
            ]
        }).as('classesRequest');

        // Visit the annotation page
        cy.visit('http://localhost:3000/annotations?id=1');
    });

    it('should allow deletion of an annotation', () => {
        // Wait for all data to load
        cy.wait('@projectRequest');
        cy.wait('@annotationProjectRequest');
        cy.wait('@classesRequest');

        // Interact with the annotation UI
        cy.get('.annolist').find('.annotated-row_annotationTitle__Qbr1X').first().click();
        cy.get('svg.annotated-row_iconCol__M1IPt').first().click();
                // Intercept the DELETE request
        cy.intercept('DELETE', `${API_BASE}annotations/deleteannotation/15`).as('deleteAnnotation');

        // Trigger the deletion action
        cy.get('button.border-dark.m-2.btn.btn-light').contains("Verwijderen").first().click();

        cy.intercept('GET', `${API_BASE}annotations/project/1`, {
            statusCode: 200,
            body: [{
            }],
        }).as('annotationProjectRequest');


        // Confirm deletion in modal
        cy.get('.modal').should('be.visible');
        cy.get('.modal').contains('Ja').click();

        // Wait for the DELETE request
        // cy.wait('@deleteAnnotation').then(interception => {
        //     assert.equal(interception.response.statusCode, 200, 'Delete request succeeded');
        // });

        // Check if the annotation is deleted
        // cy.get('.annolist').children().should('have.length', 0);

    });
});