describe("Healthcheck", () => {
  it("GET /health deve responder 200 e status do Mongo", () => {
    cy.request("/health").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("server");
      expect(res.body).to.have.property("database");
    });
  });
});
