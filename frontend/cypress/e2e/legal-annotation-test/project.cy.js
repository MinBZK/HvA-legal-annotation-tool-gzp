// // Hanna
// describe('Visit main page', () => {
//     beforeEach(() => {
//         cy.visit('http://localhost:3000/')
//             // Mock data for the list of projects
//             const mockProjects = [
//                 {
//                     id: 1, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//                     selectedArticles: 'test',
//                     annotations: [{
//                         id: 1,
//                         text: 'test',
//                         selectedWord: 'test',
//                         lawClass: null,
//                         project: null,
//                         startOffset: 1
//                     }],
//                 },
//                 {
//                     id: 2, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//                     selectedArticles: 'test',
//                     annotations: [{
//                         id: 2,
//                         text: 'test',
//                         selectedWord: 'test',
//                         lawClass: null,
//                         project: null,
//                         startOffset: 1
//                     }],
//                 }            ];
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
//
//         it('Fetch and display the list of projects', () => {
//             // Check if the list of projects is displayed
//             cy.get('.document-list li').should('have.length.greaterThan', 0);
//         });
//
//         it('Navigate to the correct URL when "Open project" button is clicked', () => {
//             // Mock data for a single project
//             const mockProjectData = {
//                     id: 1, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//                     selectedArticles: 'test',
//                     annotations: [{
//                         id: 1,
//                         text: 'test',
//                         selectedWord: 'test',
//                         lawClass: null,
//                         project: null,
//                         startOffset: 1
//                     }],
//                 }
//
//             // Click the "Open project" button for the first project
//             cy.get('.document-list li:first-child .open-button').click();
//
//             // Assert that the URL has changed to the correct annotations page URL
//             cy.url().should('include', `/annotations?id=${mockProjectData.id}`);
//         });
// })

describe('Visit main page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        // Mock data for the list of projects
            const mockProjects = [
                {
                    id: 1, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    selectedArticles: 'test',
                    annotations: [{
                        id: 1,
                        text: 'test',
                        selectedWord: 'test',
                        lawClass: null,
                        project: null,
                        startOffset: 1
                    }],
                },
                {
                    id: 2, xml_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    selectedArticles: 'test',
                    annotations: [{
                        id: 2,
                        text: 'test',
                        selectedWord: 'test',
                        lawClass: null,
                        project: null,
                        startOffset: 1
                    }],
                }            ];

            // Intercept the request for fetching projects and respond with mock data
            cy.intercept('GET', '/api/projects', mockProjects).as('getProjects');

            // Visit the main page
            cy.visit('http://localhost:3000/');

            // Wait for the project data to be fetched
            cy.wait('@getProjects');
    });

    it('Fetch and display the list of projects', () => {
        // Check if the list of projects is displayed
        cy.get('.document-list li').should('have.length.greaterThan', 0);
    });

    it('Navigate to the correct URL when "Open project" button is clicked', () => {
        // Mock data for a single project
        const mockProjectData = {
            id: 1,
            xml_content: 'Lorem ipsum dolor sit amet...',
            selectedArticles: 'test',
            annotations: [
                {
                    id: 1,
                    text: 'test',
                    selectedWord: 'test',
                    lawClass: null,
                    project: null,
                    startOffset: 1,
                },
            ],
        };

        // Click the "Open project" button for the first project
        cy.get('.document-list li:first-child .open-button').click();

        // Assert that the URL has changed to the correct annotations page URL
        cy.url().should('include', `/annotations?id=${mockProjectData.id}`);
    });

    it('Displays an error alert on failed project fetch', () => {
        // Intercept the request for fetching projects and respond with an error status code
        cy.intercept('GET', '/api/projects', { statusCode: 500 }).as('getProjects');

        // Visit the main page
        cy.visit('http://localhost:3000/');

        // Wait for the project data to be fetched
        cy.wait('@getProjects');

        // Check if the error alert is displayed
        cy.get('.alert-danger').should('contain', 'Something went wrong');
    });

    it('Displays a loading state during project fetch', () => {
        cy.intercept('GET', '/api/projects', (req) => {
            req.reply(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ statusCode: 200, body: [] });
                    }, 500);
                });
            });
        }).as('getProjects');

        // Check if the loading message is displayed
        cy.get('p.loading-message').should('exist');

        // Wait for the project data to be fetched
        cy.wait('@getProjects');

        // Check if the loading message is not displayed after the fetch
        cy.get('.loading-message').should('not.exist');
    });
});
