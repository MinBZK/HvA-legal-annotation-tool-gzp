describe('Visit annotation page', () => {
    // Before each test case, set up mock data and visit the annotation page
        beforeEach(()  => {

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

        // Function to stub the API call with updated data
        function getUpdatedDataApi(updatedText) {
            cy.intercept('GET', '/api/project/1', {
                statusCode: 200,
                body: {
                    id: 1,
                    xml_content: 'Updated content', // You might need to adjust this based on your backend response
                    selectedArticles: 'Rechtsbetrekking',
                    annotations: [{
                        id: 1,
                        text: updatedText,
                        selectedWord: 'Lorem',
                        lawClass: null,
                        project: null,
                        startOffset: 1
                    }],
                },
            }).as('getUpdatedProject');
        }

        // Before each test case, set up the initial mock data and visit the annotation page
        cy.intercept('GET', '/api/project/1', {
            id: 1,
            xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            selectedArticles: 'Rechtsbetrekking',
            annotations: [{
                id: 1,
                text: '', // Initially empty text
                selectedWord: 'Lorem',
                lawClass: null,
                project: null,
                startOffset: 1
            }],
        }).as('getProject');

        // visit annotation page
        cy.visit('http://localhost:3000/annotations?id=1');

        // wait for API call
        cy.wait('@getProject').then(() => {
            openPopupAndSelectText();

            getUpdatedDataApi('YourNoteText');

            // type 'YourNoteText' into the text input field
            cy.get('.text-input').should('exist').and('be.visible')
                .trigger('mouseup')
                .eq(0).type('YourNoteText');

            // wait for API call
            cy.wait('@getUpdatedProject');

            // check if the entered text matches the stubbed updated backend text
            cy.get('.text-input').invoke('val').should('equal', 'YourNoteText');
        });
    });
});
