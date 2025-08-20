describe("Users API", () => {
  const password = "teste123";
    let token = "";


  before(() => {

    cy.request({
      method: "POST",
      url: "/user/register",
      body: { username: "rafael", password: "teste123"},
      failOnStatusCode: false, 
    }).then((res) => {
      expect([201, 409]).to.include(res.status);
    });

  
    cy.request("POST", "/user/login", { username, password }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("token").and.to.be.a("string"); 
      token = res.body.token;
    });
  });

  it("POST /user/register -> 201 (ou 409 se já existir)", () => {
    cy.request({
      method: "POST",
      url: "/user/register",
      body: { username: "Rafael", password },
      failOnStatusCode: false,
    }).then((res) => {
      expect([201, 409]).to.include(res.status);
    });
  });

  it("POST /user/login -> retorna token", () => {
    cy.request("POST", "/user/login", { username, password }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("token").and.to.be.a("string");
    });
  });

  it("GET /user/lista sem token -> 401/403", () => {
    cy.request({
      method: "GET",
      url: "/user/lista",
      failOnStatusCode: false,
    }).then((res) => {
      expect([401, 403]).to.include(res.status);
    });
  });

  it("GET /user/lista com token -> 200", () => {
    cy.request({
      method: "GET",
      url: "/user/lista",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);

      expect(res.body).to.be.an("array");
    });
  });
});
