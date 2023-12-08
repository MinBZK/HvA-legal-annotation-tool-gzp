/// <reference types="cypress" />

describe('Visit main page', () => {
    beforeEach(() => {
      // Bezoek de annotatiepagina
      cy.visit('http://localhost:3000/annotations?id=1')
    })

    it('annotaties element bestaat', () => {

        cy.get('.annolist').should('exist')

    })
})