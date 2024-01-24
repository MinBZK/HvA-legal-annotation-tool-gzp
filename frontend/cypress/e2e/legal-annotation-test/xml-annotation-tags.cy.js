describe('XML Annotation Test', () => {

    /**
     * Highlight the text in the xml and open the annotation creation menu.
     */
    const selectTextAndTriggerAnnotationMenu = () => {
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

        selectTextAndTriggerAnnotationMenu();

        // get the first dropdown toggle
        let lawClassDropdown = cy.get('.dropdown-toggle').eq(0);

        // Press dropdown toggle and select "Variabelwaarde" as law class
        lawClassDropdown.click();
        cy.get('.dropdown-menu').contains('Variabelewaarde').click();

        // Mock the post and get annotation call
        cy.fixture('post-annotation-response.json').then((content) => {
            cy.intercept('POST', '/api/annotations/', content).as('postAnnotation');
            cy.intercept('GET', '/api/annotations/1', content).as('getAnnotation');
        });

        // Use the annotated project as the project content
        cy.fixture('project-with-annotations.json').then((content) => {
            cy.intercept('GET', '/api/project/1', content).as('getProject');
        });

        // Click the save button. The classname of that button starts with "annotated-row_save"
        cy.get('button[class^="annotated-row_save"]').click();

        // Wait for the post annotation call to finish
        cy.wait(['@postAnnotation']);

        // Finalize the annotation by clicking the "Afronden" button
        cy.get('button:contains("Afronden")').click();

        // Wait for the get annotation call to finish
        cy.wait(['@getAnnotation']);
    });

    it('should add annotation tags correctly', () => {
        // Arrange and Act are handled in the before each

        // Assert
        let annotationTag = cy.get('p.xml-content')
            .find('annotation')

        // Check if the annotation tag is present
        annotationTag.should('have.length', 1);

        // Check if the annotation tag has an id attribute with value 1, which is the id of the annotation
        annotationTag.should('have.attr', 'id', '1');
    });

    it('Should highlight the annotated text in the correct color', () => {
        // Arrange and Act are handled in the before each

        let annotationTag = cy.get('p.xml-content')
            .find('annotation')

        // Check if the annotation tag is present
        annotationTag.should('have.length', 1);

        // Check if the annotation tag has an id attribute with value 1, which is the id of the annotation
        annotationTag.should('have.attr', 'id', '1');

        // Assert if the styles are applied to the annotated text
        annotationTag.should('have.css', 'background-color', 'rgb(255, 243, 128)');
    });
});
