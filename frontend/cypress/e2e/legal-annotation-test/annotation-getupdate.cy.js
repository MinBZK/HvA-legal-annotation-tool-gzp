/// <reference types="cypress" />

describe('Visit main page', () => {
    beforeEach(() => {

        cy.intercept('GET', 'http://localhost:8000/api/project/1', (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    id: 1,
                    xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis augue eu vehicula volutpat. Integer eget ligula felis. Sed semper tristique mi, at convallis dui posuere vel. Suspendisse id tincidunt nulla. Morbi non erat vitae ipsum scelerisque hendrerit. Quisque ullamcorper nisl dolor, eu ultricies lectus mollis sit amet. Vestibulum sit amet fermentum libero. Pellentesque dignissim purus vel diam pellentesque, a rhoncus erat auctor.",
                    selectedArticles: null
                },
            })
        })
            .as('projectrequest').then(() => console.warn("loadedproject"))

        cy.intercept('GET', 'http://localhost:8000/api/annotations/project/1', (req) => {
            req.reply({
                statusCode: 200,
                body: [
                    {
                        id: 15,
                        selectedWord: "Lorem ipsum",
                        text: "test",
                        lawClass: {
                            id: 2,
                            name: "Rechtssubject",
                            color: "#c2e7ff"
                        },
                        project: {
                            id: 1,
                            xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis augue eu vehicula volutpat. Integer eget ligula felis. Sed semper tristique mi, at convallis dui posuere vel. Suspendisse id tincidunt nulla. Morbi non erat vitae ipsum scelerisque hendrerit. Quisque ullamcorper nisl dolor, eu ultricies lectus mollis sit amet. Vestibulum sit amet fermentum libero. Pellentesque dignissim purus vel diam pellentesque, a rhoncus erat auctor.",
                            selectedArticles: null
                        }
                    },
                    {
                        id: 16,
                        selectedWord: "consectetur adipiscing elit",
                        text: "second note test",
                        lawClass: {
                            id: 1,
                            name: "Rechtbetrekking",
                            color: "#70a4ff"
                        },
                        project: {
                            id: 1,
                            xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis augue eu vehicula volutpat. Integer eget ligula felis. Sed semper tristique mi, at convallis dui posuere vel. Suspendisse id tincidunt nulla. Morbi non erat vitae ipsum scelerisque hendrerit. Quisque ullamcorper nisl dolor, eu ultricies lectus mollis sit amet. Vestibulum sit amet fermentum libero. Pellentesque dignissim purus vel diam pellentesque, a rhoncus erat auctor.",
                            selectedArticles: null
                        }
                    },
                    {
                        id: 16,
                        selectedWord: "Aliquam lobortis augue eu",
                        text: "third note test",
                        lawClass: {
                            id: 3,
                            name: "Voorwaarde",
                            color: "#B7D7CD"
                        },
                        project: {
                            id: 1,
                            xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis augue eu vehicula volutpat. Integer eget ligula felis. Sed semper tristique mi, at convallis dui posuere vel. Suspendisse id tincidunt nulla. Morbi non erat vitae ipsum scelerisque hendrerit. Quisque ullamcorper nisl dolor, eu ultricies lectus mollis sit amet. Vestibulum sit amet fermentum libero. Pellentesque dignissim purus vel diam pellentesque, a rhoncus erat auctor.",
                            selectedArticles: null
                        }
                    },
                ]
            })
        }).as('annotationprojectrequest').then(() => console.warn("loadedannotationproject"))


        cy.intercept('GET', 'http://localhost:8000/api/classes', (req) => {
            req.reply({
                statusCode: 200,
                body: [
                    {
                        id: 1,
                        name: "Rechtbetrekking",
                        color: "#70a4ff"
                    },
                    {
                        id: 2,
                        name: "Rechtssubject",
                        color: "#c2e7ff"
                    },
                    {
                        id: 3,
                        name: "Voorwaarde",
                        color: "##B7D7CD"
                    },
                ]
            })
        }).as('classesrequest').then(() => console.warn("loadedclasses"))

        // Visit the annotation page
        cy.visit('http://localhost:3000/annotations?id=1').wait(3000)
    })

    it('annotatie get', () => {

        // wait for the fetching of mockdata to complete
        cy.wait("@projectrequest", {timeout: 10000})
        cy.wait("@annotationprojectrequest", {timeout: 10000})
        cy.wait("@classesrequest", {timeout: 10000})


        // check if page exists
        cy.get('.annolist').should("exist")

        // check length of annotations
        cy.get('.annolist').children().should('have.length', 3)

        // check if retrieved data is there
        cy.get('.annolist').children().first().click()
        cy.get('.annolist').children().first().contains("Rechtssubject")
        cy.get('.annolist').children().first().contains("test")
        cy.get('.annolist').children().first().contains("Lorem ipsum")

    })
})