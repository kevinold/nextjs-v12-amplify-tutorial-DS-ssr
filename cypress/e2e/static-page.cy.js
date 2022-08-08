describe('static page', () => {
    it('should render a static page', () => {
      cy.visit('/static-page')
      cy.getBySel('content').should("have.text", "This is a static page")
    })
  })