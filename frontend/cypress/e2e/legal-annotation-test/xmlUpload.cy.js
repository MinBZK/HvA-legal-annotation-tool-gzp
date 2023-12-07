/// <reference types="cypress" />

describe('Open xml upload modal', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('Check if upload button exists', () => {
        cy.get('header button').should('exist');
    })

    it('Open modal and check contents', () => {
        cy.get('header button').click();
        cy.get('.modal.show').should('exist');
        cy.get('.modal form').should('exist');
        cy.get('.modal form input').should('exist');
        cy.get('.modal form button').should('exist');
    })

})