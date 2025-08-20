const fixture = "tests/fixtures/sample.txt"; 

describe("Upload TXT", () => {
  it("POST /upload/txt -> 201", () => {
    cy.task("uploadTxt", {
      url: "/upload/txt",
      filePath: fixture,
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });
});
