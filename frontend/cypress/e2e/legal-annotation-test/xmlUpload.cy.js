/// <reference types="cypress" />

describe('Open xml upload modal', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('Check if upload button exists', () => {
        cy.get('button.import-button').should('exist');
    })

    it('Open modal and check contents', () => {
        cy.get('button.import-button').click();
        cy.get('.modal.show').should('exist');
        cy.get('.modal form').should('exist');
        cy.get('.modal form input').should('exist');
        cy.get('.modal form button').should('exist');
    })

    it('Successful file upload', () => {

        const fileName = 'test.xml';
        const fileType = 'text/xml';
        const fileInput = '.modal form input';

        cy.get('button.import-button').click();
        cy.get('.modal.show').should('exist');
        cy.upload_file(fileName, fileType, fileInput);
        cy.get('.modal form button').click();
        cy.intercept('POST', '/api/saveXml', {
            statusCode: 201,
        });
        cy.get('.modal.show').should('not.exist');
    });

    it('Failed file upload', () => {

        const fileName = 'test.xml';
        const fileType = 'text/xml';
        const fileInput = '.modal form input';

        cy.get('button.import-button').click();
        cy.get('.modal.show').should('exist');
        cy.upload_file(fileName, fileType, fileInput);
        cy.get('.modal form button').click();
        cy.intercept('POST', '/api/saveXml', {
            statusCode: 500,
        });
        cy.get('.modal.show').should('exist');
        cy.get('.modal .alert.alert-danger').should('exist');
    });

})
