describe('XML Annotation Test', () => {

    /**
     * Open the popup and select all the text in the xml-content.
     * This is needed to be able to select the text and add an annotation.
     */
    const openPopupAndSelectText = () => {

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

    const projectContent = {
        id: 1,
        xml_content: '<p xml:id="p1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
        selectedArticles: '',
        annotations: [],
    }

    /**
     * Before each test, intercept the api calls, mock their responses and create an annotation.
     * This is needed before we can perform the tests on the annotation tags.
     */
    beforeEach(() => {
        cy.intercept('GET', '/api/project/1', projectContent).as('getProject');

        cy.intercept('GET', '/api/classes', [
            { id: 1, name: 'Rechtsbetrekking', color: '#FF0000' },
            { id: 2, name: 'Rechtssubject', color: '#00FF00' },
            { id: 3, name: 'Voorwaarde', color: '#0000FF' },
        ]).as('getLawClasses');

        cy.intercept('GET', '/api/annotations/project/1', []).as('getAnnotations');

        cy.intercept('POST', '/api/saveXml', projectContent).as('postXml');

        // Visit the annotation page and wait for the api calls to finish
        cy.visit('http://localhost:3000/annotations?id=1');
        cy.wait(['@getProject', '@getLawClasses', '@getAnnotations']);

        // Select the text in the xml, open the popup and store the annotation
        openPopupAndSelectText();

        // Intercept post to api/annotations/project
        cy.intercept('POST', '/api/annotations/project', {
            id: 1,
            text: 'test',
            selectedWord: 'test',
            lawClass: null,
            project: null,
            tempId: 1
        }).as('postAnnotation');

        // press dropdown toggle and select a law class
        cy.get('.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Rechtssubject').click();

        cy.get('textarea').type('Test');

        // Save the annotation
        cy.get('button:contains("Opslaan")').click();
    });

    it('should add annotation tags correctly', () => {
        // Arrange and Act are handled in the before each

        // Assert
        // Get the added annotation tag element in the XML
        let annotationTag = cy.get('p.xml-content')
            .children('p')
            .children('annotation');

        // Check if the annotation tag is present
        annotationTag.should('have.length', 1);

        // Check if the annotation tag has an id attribute with value 1, which is the id of the annotation
        annotationTag.should('have.attr', 'id', '1');
    });

    it('Should highlight the annotated text in the correct color', () => {
        // Arrange and Act are handled in the before each

        // Assert if the styles are applied to the annotated text
        cy.get('p.xml-content')
            .children('p')
            .children('annotation')
            .should('have.css', 'background-color', 'rgb(194, 231, 255)');
    });
});
