/// <reference types="cypress" />

describe('Visit annotation page', () => {
    beforeEach(() => {
        // Bezoek de annotatiepagina
        cy.visit('http://localhost:3000/annotations?id=1')
    })

    it('annotaties element bestaat', () => {
        cy.get('.annolist').should('exist')
    })

    // Hanna

    it('Display the popup when text is selected', () => {
        // Mock data to be returned by getProjectById
        const mockData = {
            id: 2, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            selectedArticles: 'test',
            annotations: [{
                id: 1,
                text: 'test',
                selectedWord: 'test',
                lawClass: null,
                project: null,
                startOffset: 1
            }],
        }

        const lawClassOptions = [
            { id: 1, name: 'LawClass 1', color: '#FF0000' },
            { id: 2, name: 'LawClass 2', color: '#00FF00' },
            { id: 3, name: 'LawClass 3', color: '#0000FF' },
        ];

        // Intercept the data fetching request and respond with the mock data
        cy.intercept('GET', '/api/project/*', mockData).as('getProject');
        cy.intercept('GET', '/api/classes', lawClassOptions).as('getLawClasses');

        // Wait for the data fetching to complete
        cy.wait(['@getProject', '@getLawClasses']);

        // Check if the page contains the expected elements
        cy.get('.navbar-title').should('contain', 'Legal Annotation Tool');

        cy.get('p')
            .trigger('mousedown')
            .then(($el) => {
                const el = $el[0]
                const document = el.ownerDocument
                const range = document.createRange()
                range.selectNodeContents(el)
                document.getSelection().removeAllRanges(range)
                document.getSelection().addRange(range)
            })
            .trigger('mouseup')
        cy.document().trigger('selectionchange')

        // Wait for the popup to be visible
        cy.get('.modal').should('be.visible');
        cy.get('.modal-body').contains('Geselecteerde tekst: ');

        cy.get('.dropdown').should('be.visible');
        cy.get('.modal-body').contains('Notitie');
        cy.get('.modal-body').contains('Begrip');
        cy.get('.modal-footer').contains('Opslaan');
        cy.get('.modal-footer').contains('Annuleer');
        cy.get('.modal-footer').contains('Verwijder');

        // Click on the dropdown toggle to open the dropdown
        cy.get('.dropdown-toggle').click();

        cy.get('.dropdown-menu').should('be.visible');

        cy.get('.dropdown-menu').contains('LawClass 1').should('exist');
        cy.get('.dropdown-menu').contains('LawClass 2').should('exist');
        cy.get('.dropdown-menu').contains('LawClass 3').should('exist');

        cy.get('.dropdown-menu').contains('LawClass 1').click();
        cy.get('.dropdown-toggle').should('contain.text', 'LawClass 1');
    });

});
