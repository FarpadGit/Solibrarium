describe("Registration", () => {  
    it("should register a new test user", () => {
      cy.intercept("/api/auth/callback/SolibrariumProvider").as("authCallback");

      // click on Register link
      cy.get("a").contains(/regisztr/i).click();
      cy.url().should("include", "/register");
      cy.wait(2000);

      // type in test username and password
      cy.get("@testUserData").then((testUser) => {
        cy.get("#RegForm").getByLabel("Email cím").type(testUser.email);
        cy.get("#RegForm").getByLabel("Jelszó").type(testUser.password);
        cy.get("#RegForm").getByLabel("Jelszó ismét").type(testUser.password);
      });
      
      // click submit button
      cy.get("#RegForm").find("button[type='submit']").click();

      // redirect to home page, should be logged in
      cy.wait("@authCallback", {requestTimeout: 20000}).wait(2000);
      cy.url().should("match", /\/$/);
      cy.get("button").contains(/üdvözlünk/i).should("exist");
    });
  });