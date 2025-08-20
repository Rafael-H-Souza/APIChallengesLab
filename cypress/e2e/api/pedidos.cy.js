describe("Pedidos", () => {
  it("GET /pedidos responde 200", () => {
    cy.request("/pedidos?page=1&limit=5&order=desc").then((res) => {
      expect(res.status).to.eq(200);
      // dependendo da sua API, pode ser array ou objeto paginado:
      // expect(res.body).to.be.an("array");
    });
  });
});
