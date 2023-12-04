/// <reference types="cypress" />

describe('Visit main page', () => {
    beforeEach(() => {
      // Bezoek de annotatiepagina
      cy.visit('http://localhost:3000/annotations')
    })

    it('toont de annotaties correct', () => {
      // Controleer of er drie annotatierijen zijn
      cy.get('.annolist').children().should('have.length', 3)

      // Controleer de inhoud van de eerste annotatie
      cy.get('.annolist').children().eq(0).within(() => {
      })


      // Controleer de inhoud van de tweede annotatie
      cy.get('.annolist').children().eq(1).within(() => {
      })

      // Controleer de inhoud van de derde annotatie
      cy.get('.annolist').children().eq(2).within(() => {
      })
    })
})