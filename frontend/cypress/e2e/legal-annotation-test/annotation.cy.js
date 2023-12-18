// /// <reference types="cypress" />
//
// describe('Visit annotation page', () => {
//     beforeEach(() => {
//         // Bezoek de annotatiepagina
//         cy.visit('http://localhost:3000/annotations?id=1')
//     })
//
//     it('annotaties element bestaat', () => {
//         cy.get('.annolist').should('exist')
//     })
//
//     // Hanna
//
//     const openPopupAndSelectText = () => {
//         // Trigger selection event
//         cy.get('p.xml-content')
//             .trigger('mousedown')
//             .then(($el) => {
//                 const el = $el[0]
//                 const document = el.ownerDocument
//                 const range = document.createRange()
//                 range.selectNodeContents(el)
//                 document.getSelection().removeAllRanges(range)
//                 document.getSelection().addRange(range)
//             })
//             .trigger('mouseup')
//         cy.document().trigger('selectionchange')
//     }
//
//     it('Display the popup when text is selected and select a law class', () => {
//         // Load law class options from a fixture file
//         cy.fixture('lawclasses').then((lawClassOptions) => {
//             const mockLawClasses = lawClassOptions.lawClasses
//             cy.fixture('single-project').then((projectData) => {
//                 const mockProjectData = projectData;
//
//                 // Intercept the data fetching request and respond with the mock data
//                 cy.intercept('GET', '/api/project/*', mockProjectData).as('getProject');
//                 cy.intercept('GET', '/api/classes', mockLawClasses).as('getLawClasses');
//
//                 // Wait for the data fetching to complete
//                 cy.wait(['@getProject', '@getLawClasses']);
//
//                 // Check if the page contains the expected elements
//                 cy.get('.navbar-title').should('contain', 'Legal Annotation Tool');
//
//                 openPopupAndSelectText();
//                 cy.document().trigger('selectionchange');
//
//                 // Wait for the popup to be visible
//                 cy.get('.modal').should('be.visible');
//                 cy.get('.modal-body').contains('Geselecteerde tekst: ');
//
//                 cy.get('.dropdown').should('be.visible');
//                 cy.get('.modal-body').contains('Notitie');
//                 cy.get('.modal-body').contains('Begrip');
//                 cy.get('.modal-footer').contains('Opslaan');
//                 cy.get('.modal-footer').contains('Annuleer');
//                 cy.get('.modal-footer').contains('Verwijder');
//
//                 // Click on the dropdown toggle to open the dropdown
//                 cy.get('.dropdown-toggle').click();
//
//                 cy.get('.dropdown-menu').should('be.visible');
//
//                 cy.get('.dropdown-menu').contains(mockLawClasses[0].name).should('exist');
//                 cy.get('.dropdown-menu').contains(mockLawClasses[1].name).should('exist');
//                 cy.get('.dropdown-menu').contains(mockLawClasses[2].name).should('exist');
//
//                 // Click on the first law class option
//                 cy.get('.dropdown-menu').contains(mockLawClasses[0].name).click();
//
//                 // Verify that the dropdown toggle now displays the selected law class
//                 cy.get('.dropdown-toggle').should('contain.text', mockLawClasses[0].name);
//             });
//         });
//     });
//
// });
