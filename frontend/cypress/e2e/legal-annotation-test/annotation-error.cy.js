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
//     it('Shows error alert when law class is not selected', () => {
//         // Intercept the data fetching request and respond with the mock data
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
//                 cy.document().trigger('selectionchange')
//
//                 cy.get('.modal-title').should('contain', 'Annoteer de tekst');
//
//                 // Click the "Opslaan" button without selecting a law class
//                 cy.get('button:contains("Opslaan")').click();
//
//                 // Check if the error alert is visible
//                 cy.get('.alert-danger').should('be.visible');
//                 cy.get('.alert-danger').should('contain', 'Selecteer alstublieft een juridische klasse.');
//
//                 // Close the popup
//                 cy.get('button:contains("Annuleer")').click();
//             });
//         });
//     });
//
// });
