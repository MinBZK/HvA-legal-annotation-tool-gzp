// Chi Yu
describe('Visit annotation page', () => {
    // Before each test case, visit the annotation page
    beforeEach(() => {
        // Function to open the pop-up and select text
        // Hanna
        function openPopupAndSelectText() {
            // Trigger selection event
            cy.get('p.xml-content')
                .trigger('mousedown')
                .then(($el) => {
                    const el = $el[0];
                    const document = el.ownerDocument;
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    document.getSelection().removeAllRanges(range);
                    document.getSelection().addRange(range);
                })
                .trigger('mouseup');
            cy.document().trigger('selectionchange');
        }

        cy.intercept('GET', '/api/project/1', {
            statusCode: 200,
            body: {
                id: 1,
                xml_content: 'Updated content', // You might need to adjust this based on your backend response
                selectedArticles: 'Rechtsbetrekking',
                annotations: [{
                    id: 1,
                    text: '',
                    selectedWord: 'Lorem',
                    lawClass: null,
                    project: null,
                    tempId: 1
                }],
            },
        }).as('getUpdatedProject');

        // Before each test case, visit the annotation page
        cy.visit('http://localhost:3000/annotations?id=1');

        // Call the function to open the pop-up and select text
        openPopupAndSelectText();
    });

    // Test to enter text
    it('Enter text', () => {
        // Type 'test' into the text input field
        cy.get('.text-input').should('exist').and('be.visible')
            .trigger('mouseup')
            .eq(0).type('test');

        // Click the "Annuleer" button
        cy.get('button:contains("Annuleer")').click();

        // Check if the entered text is still present in the text input field
        cy.get('.text-input').invoke('val').should('equal', 'test');
    });

    it('should execute the POST function after saving', () => {
        // Stub the POST request to the backend
        cy.intercept('POST', '/api/project/*').as('postFunction');

        // Trigger the save action
        cy.get('button:contains("Opslaan")').click().then(() => {
            cy.log('Opslaan button clicked');
        });

        // Wait for the POST request to be made
        cy.intercept('POST', '/api/project/*', { delayMs: 500 }).as('postFunction');
    });
});
