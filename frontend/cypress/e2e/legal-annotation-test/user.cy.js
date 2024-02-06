import '../../support/commands';

describe('Test user functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [],
    });

    cy.intercept_initial_user_create();
  });

  it('Check if user button exists', () => {
    cy.get('button.select-user').should('exist');
  });

  it('Check if on no users create Admin user', () => {
    cy.get('button.select-user').click();
    cy.get('.user-select').then((userList) => {
      if (userList.length === 1) return true;
      return false;
    });
  });

  it('Check if all modal buttons exist', () => {
    cy.get('button.select-user').click();
    cy.get('button.switch-user').should('exist');
    cy.get('.user-select button.delete-button').should('exist');
    cy.get('button.new-user').should('exist');
  });

  it('Check if created user has right values', () => {
    cy.get('button.select-user').click();
    cy.get('.user-select span').each(($el) => {
      if ($el.text() === 'Admin') return true;
      return false;
    });
  });

  it('Check if user is set in localstorage after select', () => {
    cy.get('button.select-user').click();
    cy.wait(1000);
    cy.window().then((win) => {
      const itemValue = win.localStorage.getItem('user');
      expect(itemValue).to.equal('{"id":1,"role":"Admin","name":"Admin"}');
    });
  });

  it('Check if create new user works', () => {
    cy.get('button.select-user').click();

    cy.intercept('GET', '/api/users/roles', {
      statusCode: 200,
      body: ['Admin', 'Jurist', 'User'],
    });

    cy.create_new_user();
  });
});
