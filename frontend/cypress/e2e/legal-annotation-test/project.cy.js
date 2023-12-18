// // // Hanna
// describe('Visit main page', () => {
//     beforeEach(() => {
//         cy.visit('http://localhost:3000/')
//         // Mock data for the list of projects
//         cy.fixture('projects').then((projects) => {
//             const mockProjects = projects.projects
//
//             // Intercept the request for fetching projects and respond with mock data
//             cy.intercept('GET', '/api/projects', mockProjects).as('getProjects');
//
//             // Visit the main page
//             cy.visit('http://localhost:3000/');
//
//             // Wait for the project data to be fetched
//             cy.wait('@getProjects');
//         });
//     });
//
//     it('Fetch and display the list of projects', () => {
//         // Check if the list of projects is displayed
//         cy.get('.document-list li').should('have.length.greaterThan', 0);
//     });
//
//     // Hanna
//     it('Navigate to the correct URL when "Open project" button is clicked', () => {
//         // Click the "Open project" button for the first project
//         cy.get('.document-list li:first-child .open-button').click();
//
//         cy.fixture('projects').then((projects) => {
//             const mockProjectData = projects.projects[0];
//             // Assert that the URL has changed to the correct annotations page URL
//             cy.url().should('include', `/annotations?id=${mockProjectData.id}`);
//         });
//     });
//
//     it('Displays an error alert on failed project fetch', () => {
//         // Intercept the request for fetching projects and respond with an error status code
//         cy.intercept('GET', '/api/projects', { statusCode: 500 }).as('getProjects');
//
//         // Visit the main page
//         cy.visit('http://localhost:3000/');
//
//         // Wait for the project data to be fetched
//         cy.wait('@getProjects');
//
//         // Check if the error alert is displayed
//         cy.get('.alert-danger').should('contain', 'Something went wrong');
//     });
//
//     it('Displays a loading state during project fetch', () => {
//         cy.fixture('projects.json').then((projects) => {
//             const mockProjects = projects.projects
//
//             // Intercept the request for fetching projects and respond with mock data
//             cy.intercept('GET', '/api/projects', mockProjects).as('getProjectsAfterLoading');
//
//             // Check if the loading message is displayed
//             cy.get('p.loading-message').should('exist');
//
//             // Wait for the project data to be fetched
//             cy.wait('@getProjectsAfterLoading');
//
//             // Check if the loading message is not displayed after the fetch
//             cy.get('p.loading-message').should('not.exist');
//         });
//     });
// });
