describe('api/postsroute', () => {
  it('renders a response', () => {
    cy.request('/api/posts').then(
      (response) => {
        expect(response.body).to.have.property('posts')
      }
    )
  })
})