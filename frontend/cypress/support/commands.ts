/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Cypress.Commands.add('upload_file', (fileName, fileType, selector) => {
//     cy.get(selector).then(subject => {
//         cy.fixture(fileName, 'hex').then((fileHex) => {
//
//             const fileBytes = hexStringToByte(fileHex);
//             const testFile = new File([fileBytes], fileName, {
//                 type: fileType
//             });
//             const dataTransfer = new DataTransfer()
//             const el = subject[0]
//
//             dataTransfer.items.add(testFile)
//             el.files = dataTransfer.files
//         })
//     })
// })

// UTILS
// function hexStringToByte(str) {
//     if (!str) {
//         return new Uint8Array();
//     }
//
//     var a = [];
//     for (var i = 0, len = str.length; i < len; i += 2) {
//         a.push(parseInt(str.substr(i, 2), 16));
//     }
//
//     return new Uint8Array(a);
// }
