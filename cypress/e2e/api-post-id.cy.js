describe('api/postsroute', () => {
  it('renders a response', () => {
    cy.request('/api/posts').then(
      (response) => {
        expect(response.body).to.have.property('posts')
        const post = response.body.posts[0]
        cy.request(`/api/post/${post.id}`).then(
          (resp) => {
            expect(resp.body).to.have.property('title', post.title)
          }
        )
      }
    )
  })
})