describe('api/cookies route', () => {
  it('sets a cookie', () => {
    cy.request('/api/cookies').then(
      (response) => {
      }
    )
    cy.getCookie('Next.js').should('have.property', 'value', 'api-middleware!')
  })
})