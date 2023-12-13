/// <reference types="cypress" />

describe('Visit main page', () => {
    beforeEach(() => {

        cy.intercept('GET', 'http://localhost:8000/api/project/1', (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    id: 1,
                    xml_content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis augue eu vehicula volutpat. Integer eget ligula felis. Sed semper tristique mi, at convallis dui posuere vel. Suspendisse id tincidunt nulla. Morbi non erat vitae ipsum scelerisque hendrerit. Quisque ullamcorper nisl dolor, eu ultricies lectus mollis sit amet. Vestibulum sit amet fermentum libero. Pellentesque dignissim purus vel diam pellentesque, a rhoncus erat auctor. Aenean consectetur sapien eu dolor efficitur, in pretium metus porttitor. Sed et enim at augue iaculis tristique sed tincidunt nunc.",
                    selectedArticles: null
                },
            })
        })
            .as('projectrequest').then(currentSubject => console.warn("loadedproject"))

        cy.intercept('GET', 'http://localhost:8000/api/annotations/project/1', (req) => {
            req.reply({
                statusCode: 200,
                body: [{
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
                }]
            })
        }).as('annotationprojectrequest').then(currentSubject => console.warn("loadedannotationproject"))


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
                ]
            })
        }).as('classesrequest').then(currentSubject => console.warn("loadedclasses"))

        // Bezoek de annotatiepagina
        cy.visit('http://localhost:3000/annotations?id=1').wait(3000)
    })

    it('annotatie get', () => {

        // cy.wait('@projectrequest').then((interception) => {

        // })

        cy.wait("@projectrequest", {timeout: 10000})
        cy.wait("@annotationprojectrequest", {timeout: 10000})
        cy.wait("@classesrequest", {timeout: 10000})


        // const element = cy.get('al').contains('aldaar').first()
        const element = cy.get('p').contains('Lorem').first()

        element.should("be.visible")
        element.trigger('mousedown').then(($el) => {
            const el = $el[0]
            const document = el.ownerDocument
            const range = document.createRange()
            range.selectNodeContents(el)
            document.getSelection().removeAllRanges(range)
            document.getSelection().addRange(range)

            console.warn(document.getSelection())
            console.warn(document.getSelection().toString())

            element.click()
        })
            .wait(3000)


        // const dropdownBasic = cy.get('#dropdown-basic')
        // const noteInput = cy.get('#exampleForm.ControlInput1')
        // const buttonSave = cy.get('.btn-primary')

        // select type
        // dropdownBasic.click()
        // cy.get(".dropdown-item").first().click()

        // type note
        // noteInput.type("test notitie blablabla")

        // press save
        // buttonSave.click().then(currentSubject => {
        //     cy.visit('http://localhost:3000/annotations?id=1').wait(1000)
        // })

        cy.get('.annolist').children().should('have.length', 1)

        // })
    })
})