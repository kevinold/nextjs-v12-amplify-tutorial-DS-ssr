describe('home page functionality', () => {
  it('should render posts using SSR', () => {
    cy.visit('/')
    cy.getBySel('posts-count').should("have.text", 2)

    cy.getBySelLike('post-').should("have.length", 2)
  })
})