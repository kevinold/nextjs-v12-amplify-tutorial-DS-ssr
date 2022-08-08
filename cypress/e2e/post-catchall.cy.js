describe("post catchall route", () => {
  it("should respond to post/abc/123", () => {
    cy.visit("/post/abc/123");
    cy.get("h1").should("contain", "abc/123");
  });

  it("should respond post/def/456", () => {
    cy.visit("/post/def/456");
    cy.get("h1").should("contain", "def/456");
  });
});
