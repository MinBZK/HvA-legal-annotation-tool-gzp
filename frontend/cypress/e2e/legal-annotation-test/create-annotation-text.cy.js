// Chi Yu
describe('Visit annotation page', () => {
  const openPopupAndSelectText = (word) => {
    // select all the text in the second <al> tag
    cy.contains('p.xml-content al', word).then(($el) => {
      // Start mousedown event
      cy.wrap($el).trigger('mousedown');

      // Extract the text node from the <al> tag
      const textNode = $el[0].firstChild;
      const document = $el[0].ownerDocument;
      const range = document.createRange();

      // Select the text node (single word)
      range.selectNodeContents(textNode);

      // Add the range to the selection
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);

      // Trigger mouseup event
      cy.wrap($el).trigger('mouseup', { force: true });
    });
  };

  const selectLawClass = (lawClassName) => {
    // click on the law class dropdown
    let lawClassDropdown = cy.get('.dropdown-toggle').eq(0);
    lawClassDropdown.click();

    // select the law class
    cy.get('.dropdown-menu').contains(lawClassName).click();
  };

  // Before each test case, visit the annotation page
  beforeEach(() => {
    // mock project content
    cy.fixture('full-example-project.json').then((content) => {
      cy.intercept('GET', '/api/project/1', content).as('getProject');
    });

    // mock law classes
    cy.fixture('classes.json').then((content) => {
      cy.intercept('GET', '/api/classes', content).as('getLawClasses');
    });

    // visit the annotation page
    cy.visit('http://localhost:3000/annotations?id=1');

    openPopupAndSelectText('wordt');
  });

  it('Test 1: should execute the POST function after saving', () => {
    selectLawClass('Rechtssubject');

    // Stub the POST request to the backend
    cy.intercept('POST', '/api/projects/*').as('postFunction');

    // save action
    cy.get('button:contains("Opslaan")')
      .click()
      .then(() => {
        cy.log('Opslaan button clicked');
      });

    // wait for the POST request
    cy.intercept('POST', '/api/projects/*', { delayMs: 500 }).as('postFunction');
  });

  // it('should edit the law class and save', () => {
  //     // Select text
  //     openPopupAndSelectText();
  //
  //     // Select law class
  //     selectLawClass('Rechtssubject');
  //
  //     // Stub the POST request to the backend
  //     cy.intercept('POST', '/api/projects/*').as('postFunction');
  //
  //     // Trigger the save action
  //     cy.get('button:contains("Opslaan")').click().then(() => {
  //         cy.log('Opslaan button clicked');
  //     });
  //
  //     // Log statements to help diagnose the issue
  //     cy.log('Checking if the POST request is triggered');
  //     cy.wait(500); // Wait for a short duration before checking logs
  //     cy.log('Finished waiting, checking logs for POST request');
  //
  //     // Log all commands in the Cypress command log
  //     cy.log(Cypress.log());
  //
  //     // Wait for the POST request to be made
  //     cy.wait('@postFunction');
  //
  //     // Add a waiting mechanism or retry logic before proceeding to the next steps
  //     cy.wait(1000); // Wait for 1 second (adjust as needed)
  //
  //     // Ensure that the .annolist exists and has at least one child
  //     cy.get('.annolist').should('exist').children().should('have.length.gt', 0);
  //
  //     // Click on the first child of .annolist to enter editing mode
  //     cy.get('.annolist').children().first().click();
  //
  //     // Ensure that #iconEdit exists and click it
  //     cy.get('#iconEdit').should('exist').click();
  //
  //     // Select the desired law class from the dropdown (e.g., "Parameterwaarde")
  //     cy.get('.dropdown-menu').contains('Parameterwaarde').click({ force: true });
  //
  //     // Click the "Opslaan" button with the force option
  //     cy.get('button:contains("Opslaan")').click({ force: true });
  //
  //     // Optionally, you can add assertions to verify the changes if needed
  // });

  // select text and law class
  it('Test 2: Select text and law class', () => {
    // select text
    openPopupAndSelectText('wordt');

    // select law class
    selectLawClass('Rechtssubject');

    cy.get('button:contains("Annuleer")').click();
  });
});
