describe('api/hello route', () => {
  it('renders a response', () => {
    cy.request('/api/hello').then(
      (response) => {
        expect(response.body).to.have.property('name', 'John Doe')
      }
    )
  })
})