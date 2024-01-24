/// <reference types="cypress" />

describe('Visit main page', () => {
    beforeEach(() => {

        // Visit main page
        cy.visit('http://localhost:3000')
            // .wait(3000)

        // // Get import button and click it
        // cy.get(".import-button").should("exist")
        // cy.get(".import-button").click()
        //
        //
        // // import file
        // cy.get('input[type=file]').selectFile('cypress/files/BWBR0038456_2023-10-01_0.xml')
        // cy.wait(1500)
        // cy.get(".save").click()
    })

    it('imported file has 9 articles', () => {
        cy.wait(500)

        // Get import button and click it
        cy.get(".import-button").should("exist")
        cy.get(".import-button").click()

        // import file
        cy.get('input[type=file]').selectFile('cypress/files/BWBR0038456_2023-10-01_0.xml')
        cy.wait(1500)
        cy.get(".save").click()


        cy.get(".modal-body").children().should("have.length", 9)
    })


    it('selecting specific articles', () => {
        cy.wait(500)

        // Get import button and click it
        cy.get(".import-button").should("exist")
        cy.get(".import-button").click()


        // import file
        cy.get('input[type=file]').selectFile('cypress/files/BWBR0038456_2023-10-01_0.xml')
        cy.wait(1500)
        cy.get(".save").click()


        // Should be disabled when nothing selected
        cy.get("#confirmSelectionButton").should("be.disabled")

        // select first article
        const firstArti = cy.get(".modal-body").children().first()
        firstArti.should("contain", "Artikel 1")
        firstArti.click()


        cy.get("#confirmSelectionButton").should("not.be.disabled")
        cy.get("#confirmSelectionButton").click()

        cy.wait(2000)

        cy.get(".document-list").children().should("have.length.above", 2)

    })

})
