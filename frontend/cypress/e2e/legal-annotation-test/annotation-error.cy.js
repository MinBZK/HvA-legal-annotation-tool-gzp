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

    const openPopupAndSelectText = () => {
        // Trigger selection event
        cy.get('p.xml-content')
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
    }

    it('Shows error alert when law class is not selected', () => {
        // openPopupAndSelectText();

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
        cy.intercept('GET', '/api/project/*', mockData).as('getProject2');
        cy.intercept('GET', '/api/classes', lawClassOptions).as('getLawClasses2');

        // Wait for the data fetching to complete
        cy.wait(['@getProject2', '@getLawClasses2']);

        // Check if the page contains the expected elements
        cy.get('.navbar-title').should('contain', 'Legal Annotation Tool');

        openPopupAndSelectText();
        cy.document().trigger('selectionchange')

        cy.get('.modal-title').should('contain', 'Annoteer de tekst');

        // Click the "Opslaan" button without selecting a law class
        cy.get('button:contains("Opslaan")').click();

        // Check if the error alert is visible
        cy.get('.alert-danger').should('be.visible');
        cy.get('.alert-danger').should('contain', 'Selecteer alstublieft een juridische klasse.');

        // Close the popup
        cy.get('button:contains("Annuleer")').click();
    });

});
