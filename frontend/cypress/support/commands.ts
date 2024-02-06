declare namespace Cypress {
  interface Chainable {
    intercept_initial_user_create: () => Chainable<any>;
    create_new_user: () => Chainable<any>;
  }
}

Cypress.Commands.add(
  'intercept_initial_user_create',
  (
    users = [
      {
        id: 1,
        role: 'Admin',
        name: 'Admin',
      },
    ],
  ) => {
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
    });
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: users,
    }).as('getUsers');
  },
);

Cypress.Commands.add('create_new_user', () => {
  cy.get('button.new-user').click();
  cy.get('#userName').type('New user');
  cy.get('#userRole').select('Jurist');
  cy.get('button.create-user').click();

  cy.intercept('POST', '/api/users', {
    statusCode: 201,
  });

  cy.intercept('GET', '/api/users', {
    statusCode: 200,
    body: [
      {
        id: 1,
        role: 'Admin',
        name: 'Admin',
      },
      {
        id: 2,
        role: 'Jurist',
        name: 'New user',
      },
    ],
  });

  cy.get('.modal.show').should('exist');

  cy.get('.user-select').then((userList) => {
    if (userList.length === 2) return true;
    return false;
  });
});
