describe('Open XML upload modal', () => {
    beforeEach(() => {
        // Mock the response for the maximum XML count
        cy.intercept('GET', 'http://localhost:8000/api/maxXmlCount', {
            statusCode: 200,
            body: 40
        }).as('getMaxXmlCount');

        // Mock the response for the current project count
        cy.intercept('GET', 'http://localhost:8000/api/projectCounts', {
            statusCode: 200,
            body: { currentCount: 40, maxCount: 40 } // Mock the response to reflect 40 current projects
        }).as('getProjectCounts');

        cy.visit('http://localhost:3000/');
    });

    it('should display a warning message when 40 XMLs are already uploaded', () => {
        // Wait for the mocked responses
        cy.wait(['@getMaxXmlCount', '@getProjectCounts']);

        // Check if the max XML count is displayed on the screen
        cy.get('.xml-minmax').should('contain', '40/40');

        // Assert that the warning Alert is present and visible
        cy.get('.alert-warning').should('be.visible')
            .and('contain', 'U heeft het maximale aantal van 40 XML\'s bereikt. Verwijder eerst een XML voordat u verder gaat.');

    });
});
