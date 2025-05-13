describe("Deletion", () => {  
    it("should delete guest user", () => {
      cy.intercept("/api/auth/callback/SolibrariumProvider").as("authCallback");

      // click on login button
      cy.get("button").contains(/belépés/i).click().wait(2000);
   
      // within login modal, type in test username and password
      cy.get("[aria-modal='true']").within(() => {
        cy.get("@testUserData").then((testUser) => {
          cy.getByLabel("Email cím").type(testUser.email);
          cy.getByLabel("Jelszó").type(testUser.password);
          cy.get("button[type='submit']").click().wait("@authCallback", {requestTimeout: 10000});
        });
      });

      // click on Welcome button (hover event doesn't seem to work but clicking on it does the same)
      // then click Delete Account button and click confirm
      cy.get("button").contains(/üdvözlünk/i).click();
      cy.get("[role='option']").contains(/fiók törlése/i).click();
      cy.get(".modal button").contains(/törlés/i).click();
      cy.wait(1000);

      // should be logged out
      cy.get("button").contains(/belépés/i).should("exist");
     });
  });