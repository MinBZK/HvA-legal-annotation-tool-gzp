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

    /**
     * Before each test, intercept the api calls, mock their responses and create an annotation.
     * This is needed before we can perform the tests on the annotation tags.
     */
    beforeEach(() => {
        // Mock the project content
        cy.fixture('full-example-project.json').then((content) => {
            cy.intercept('GET', '/api/project/1', content).as('getProject');
        });

        // Mock the law classes
        cy.fixture('classes.json').then((content) => {
            cy.intercept('GET', '/api/classes', content).as('getLawClasses');
        });

        // Mock the save xml call
        cy.fixture('full-example-project.json').then((content) => {
            cy.intercept('POST', '/api/saveXml', {
                statusCode: 201,
                body: content
            }).as('postXml');
        });

        // Visit the annotation page and wait for the api calls to finish
        cy.visit('http://localhost:3000/annotations?id=1');
        cy.wait(['@getProject']);

        // Select all the text in the second <al> tag
        cy.get('p.xml-content')
            .find('al')
            .eq(1)
            .then(($al) => {
                // Start mousedown event
                cy.wrap($al).trigger('mousedown');

                // Extract the text node from the <al> tag
                const textNode = $al[0].firstChild;
                const document = $al[0].ownerDocument;
                const range = document.createRange();

                // Select the text node
                range.selectNodeContents(textNode);

                // Add the range to the selection
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(range);

                // Trigger mouseup event
                cy.wrap($al).trigger('mouseup', { force: true });
            });





        // // Select the text in the xml, open the popup and store the annotation
        // openPopupAndSelectText();
        //
        // // Intercept post to api/annotations
        // cy.intercept('POST', '/api/annotations/', {
        //     id: 1,
        //     text: 'test',
        //     selectedWord: 'test',
        //     lawClass: null,
        //     project: null,
        //     tempId: 1
        // }).as('postAnnotation');
        //
        // // press dropdown toggle and select a law class
        // cy.get('.dropdown-toggle').click();
        // cy.get('.dropdown-menu').contains('Rechtssubject').click();
        //
        // cy.get('textarea').type('Test');
        //
        // // Save the annotation
        // cy.get('button:contains("Opslaan")').click();
    });

    it('should add annotation tags correctly', () => {
        // Arrange and Act are handled in the before each

        // Assert
        // Get the added annotation tag element in the XML
        // let annotationTag = cy.get('p.xml-content')
        //     .children('p')
        //     .children('annotation');

        // Check if the annotation tag is present
        // annotationTag.should('have.length', 1);
        //
        // // Check if the annotation tag has an id attribute with value 1, which is the id of the annotation
        // annotationTag.should('have.attr', 'id', '1');
    });

    // it('Should highlight the annotated text in the correct color', () => {
    //     // Arrange and Act are handled in the before each
    //
    //     // Assert if the styles are applied to the annotated text
    //     cy.get('p.xml-content')
    //         .children('p')
    //         .children('annotation')
    //         .should('have.css', 'background-color', 'rgb(194, 231, 255)');
    // });
});
