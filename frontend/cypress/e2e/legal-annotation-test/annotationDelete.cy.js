// const API_BASE = 'http://localhost:8000/api/';
//
// describe('Visit main page', () => {
//     // arrange
//     beforeEach(() => {
//         cy.visit('http://localhost:3000/annotations?id=1')
//     });
//
//     it('should allow deletion of an annotation', () => {
//
//         //arrange
//         // Interact with the annotation UI
//         cy.get('.annolist').find('.annotated-row_annotationTitle__Qbr1X').first().click();
//         cy.get('svg.annotated-row_iconCol__M1IPt').first().click();
//
//         // Intercept the DELETE request
//         cy.intercept(`http://localhost:8000/api/annotations/deleteannotation/*`,
//             {
//                 statusCode: 200,
//                 body: {}
//             }
//         ).as("deleteAnnotation");
//
//
//         // Act
//         // Trigger the deletion action
//         cy.get('button.border-dark.m-2.btn.btn-light').contains("Verwijderen").first().click();
//         // Confirm deletion in modal
//         cy.get('.modal').should('be.visible');
//         cy.get('.modal').contains('Ja').click();
//
//         // Assert
//         // expect the annotation to be deleted
//         cy.wait('@deleteAnnotation').then(interception => {
//             expect(interception.response.statusCode).to.eq(200);
//         });
//
//     });
// });
