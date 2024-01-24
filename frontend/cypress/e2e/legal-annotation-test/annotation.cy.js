/// <reference types="cypress" />

import {Cardinality, LawClass} from "../../../src/app/models/relation";

describe('Visit annotation page', () => {

    function openAnnotationForm(position) {
        cy.get('p.xml-content')
            .find('al')
            .eq(position)
            .then(($al) => {
                // Start mousedown event
                cy.wrap($al).trigger('mousedown');

                // Extract the text node from the <al> tag
                const textNode = $al[0].firstChild;
                const document = $al[0].ownerDocument;
                const range = document.createRange();

                // Select the text node
                range.selectNodeContents(textNode);

                // Add the range to the selection
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(range);

                // Trigger mouseup event
                cy.wrap($al).trigger('mouseup', { force: true });
            });
    }

    beforeEach('LoadXML Component', () => {
            cy.visit('http://localhost:3000/annotations?id=1')

            cy.fixture('full-example-project.json').then((content) => {
                cy.intercept('GET', '/api/project/*', content).as('getProject');
            });

            // Mock the law classes
            cy.fixture('lawclasses.json').then((content) => {
                cy.intercept('GET', '/api/classes', content).as('getLawClasses');
            });

            cy.fixture('full-example-project.json').then((content) => {
                cy.intercept('POST', '/api/saveXml', {
                    statusCode: 201,
                    body: content
                }).as('postXml');
            });

            cy.visit('http://localhost:3000/annotations?id=1');
            cy.wait(['@getProject']);

        openAnnotationForm(1)

        cy.intercept('GET', 'api/relations/*', {
            fixture: 'relations_rechtsbetrekking.json',
            statusCode: 200 // Add the desired status code here
        }).as('fetchRelations');

    });

    describe('Content Loaded Checks', () => {
        it('should check if wetvorm, notitie, begrip are loaded in the component', () => {

            // Check if wetvorm is loaded
            cy.get('label[for="selectedText"]').should('exist');
            cy.get('.dropdown').should('exist');

            // Check if notitie is loaded
            cy.get('.form-label').should('exist');
            cy.get('.text-input').should('exist');

            // Check if begrip is loaded
            cy.get('#dropdown-basic.dropdown.dropdown-toggle.btn.btn-secondary').should('exist');
        });
    });

    describe('Error Handling: Law Class Not Selected', () => {
        it('should show an error modal when law class is not selected', () => {
            // Do not select a law class

            // Intercept the saveXml API call
            cy.intercept('POST', '/api/saveXml').as('updateXml');

            // Click on the save button
            cy.get('.annotated-row_save__jb9BE').click();

            // Check if the error modal is visible
            cy.get('.alert').should('be.visible');
            cy.get('.alert-heading.h4').should('include.text', 'Error');
            cy.get('.alert p').should('include.text', 'Selecteer alstublieft een juridische klasse.');
        });
    });

    describe('Save annotation interactions', () => {
        it('save, show modals, button should turn green', () => {
            // Select a law class
            cy.get('#dropdown-basic').click(); // Click on the law class dropdown
            cy.get('.dropdown-menu').contains('Rechtsbetrekking').click(); // Replace 'YourLawClass' with the desired law class

            cy.intercept('GET', 'api/lawclasses/*', {
                statusCode: 200,
                body: {
                    id:2,
                    name:"Rechtssubject",
                    color:"#c2e7ff",
                    annotations:[],
                }
            }).as('fetchLawClass');

            // Mock the saveAnnotationToBackend API call
            cy.intercept('POST', '/api/annotations/', {
                statusCode: 201,
                body: {
                    id: 123,
                    selectedWord: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:",
                    text: "",
                    lawClass: { name: "Rechtsbetrekking" },
                    project: { id: 1 },
                    term: { definition: null, reference: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:" },
                    parentAnnotation: null,
                    relation: null,
                    created_at: Date.now(),
                    created_by: "Admin"
                }
            }).as('saveAnnotation');

            cy.intercept('POST', 'api/saveXml', {
                statusCode: 200,
                body: { message: 'XML updated successfully' },
            }).as('updateXml');

            // Click on the save button
            cy.get('.annotated-row_save__jb9BE').click();

            // intercept save annotation
            cy.wait('@saveAnnotation').then((interception) => {
                // Check if the request was successful
                expect(interception.response.statusCode).to.equal(201);

                // Access the saved annotation data if needed
                const savedAnnotation = interception.response.body;
                // Perform assertions or continue with your test logic
            });

            cy.wait('@updateXml');

            cy.wait('@fetchRelations').then((interception) => {
                // Check if the request was successful
                expect(interception.response.statusCode).to.equal(200);

                // Access the mocked relations data if needed
                const mockedRelations = interception.response.body;
                // Perform assertions or continue with your test logic
            });

            // Check if relation buttons appear
            cy.get('.relation-buttons').should('be.visible');

            // // Click on a verplicht relation button
            cy.get('.relation-buttons p:contains("Verplicht") + button').first().click();

            cy.wait('@fetchLawClass').then((interception) => {
                // Access the intercepted request and response
                const { request, response } = interception;
                // Perform assertions or continue with your test logic
                expect(response.statusCode).to.equal(200);
                // ... other assertions based on the response
            });

            cy.wait(1000)

            openAnnotationForm(3)

            cy.intercept('POST', '/api/annotations/', {
                statusCode: 201,
                body: {
                    id: 124,
                    selectedWord: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:",
                    text: "",
                    lawClass: { name: "Rechtssubject" },
                    project: { id: 1 },
                    term: { definition: null, reference: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:" },
                    parentAnnotation: {id: 123},
                    relation: {id: 1},
                    created_at: Date.now(),
                    created_by: "Admin"
                }
            }).as('saveSubAnnotation');

            // Save subannotationdetails
            cy.get('.annotated-row_save__jb9BE').contains('Opslaan').click();

            cy.intercept('GET', 'api/annotations/children/123', {
                statusCode: 200,
                body: [
                    {
                        id: 124,
                        selectedWord: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:",
                        text: "",
                        lawClass: { name: "Rechtsbetrekking" },
                        project: { id: 1 },
                        term: { definition: null, reference: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:" },
                        parentAnnotation: {id: 123},
                        relation: {id:1},
                        created_at: Date.now(),
                        created_by: "Admin"
                    }
                ],
            }).as('getChildAnnotations');

            cy.wait('@saveSubAnnotation').then((interception) => {
                // Check if the request was successful
                expect(interception.response.statusCode).to.equal(201);

                // Access the saved annotation data if needed
                const savedAnnotation = interception.response.body;
                // Perform assertions or continue with your test logic
            });

            cy.wait('@getChildAnnotations').then((interception) => {
                // Access the intercepted request and response
                const { request, response } = interception;
                expect(response.statusCode).to.equal(200);
            });

            cy.wait('@updateXml');

            // Check if the relation button turns green
            cy.get('.relation-buttons button').first().should('have.css', 'background-color', 'rgba(76, 167, 74, 0.255)');

            // Click on Afronden button
            cy.get('.annotated-row_save__jb9BE').contains('Afronden').click();

            // // Check if the modal is visible
            cy.get('.modal').should('be.visible');
            cy.get('.modal-title').should('include.text', 'U heeft niet alle verplichte relaties gelegd');
            cy.get('.modal-footer button:contains("Ja")').click();

            cy.wait(1000)

            // // Check if the modal is visible
            cy.get('.modal').should('be.visible');
            cy.get('.modal-title').should('include.text', 'U heeft nog ingevulde velden');
            cy.get('.modal-footer button:contains("Ja")').click();

            cy.get('.annotationInfo').should('not.exist')
        });
    });
});
