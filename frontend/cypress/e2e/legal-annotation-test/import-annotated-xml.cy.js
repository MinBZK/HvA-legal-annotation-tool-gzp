describe('Import Annotated XML Test', () => {

    /**
     * The goal of this test case is to test if annotations that exist in the database and in a newly imported xml file
     * are properly displayed. The beforeEach will not go through the full annotation creation process nor the xml import
     * process since this is all tested in other test cases. Instead, These tests are only meant to test what happens
     * after the annotation- and import processes are finished.
     */
    beforeEach(() => {
        // Mock the project content
        cy.fixture('project-with-annotations.json').then((content) => {
            cy.intercept('GET', '/api/project/1', content).as('getProject');
        });

        // Mock the annotation
        cy.fixture('imported-annotation.json').then((content) => {
            cy.intercept('GET', '/api/annotations/1', content).as('getAnnotation');
        });

        cy.visit('http://localhost:3000/annotations?id=1');
        cy.wait(['@getProject', '@getAnnotation']);
    });

    /**
     * There should be only one annotation tag in the xml and in the annotation list.
     */
    it('Should display the annotated text in the law text', () => {
        let annotationTag = cy.get('p.xml-content')
            .find('annotation')

        annotationTag.should('have.length', 1);
        annotationTag.should('have.attr', 'id', '1');
    });

    /**
     * The annotation should be displayed in the annotation list.
     */
    it('Should display the annotation in the annotation list', () => {
        // Find the annotatin list with the class that starts with "annotation-view_annotatedRow"
        let annotationList = cy.get('div[class^="annotation-view_annotatedRow"]');

        // Click the annotation list to open it
        annotationList.click();

        // Get the annotation info
        let annotationInfo = cy.get('div[class^="annotated-row_annotationInfo"]');

        // Check if the annotation info is present
        annotationInfo.should('have.length', 1);

        // Check if it is the correct annotation by checking the Label
        annotationInfo.should('contain', 'In deze wet en de daarop berustende bepalingen wordt verstaan onder:');


    });

});