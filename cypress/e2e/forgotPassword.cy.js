describe("Resetting password", () => {    
      it("should send a request to reset the user's password", () => {
        cy.intercept("/api/auth/callback/SolibrariumProvider").as("authCallback");
        cy.get("@testUserData").then((testUser) => {
            cy.intercept("POST", "/api/forgotPassword", testUser.email);
            cy.intercept("GET", "/api/forgotPassword*", testUser.email);
        });

        // click on login button, then Forgot Password link
        cy.get("button").contains(/belépés/i).click().wait(2000);
        cy.get("a").contains(/elfelejt/i).click();

        // forgotPassword page
        cy.url().should("contain", "forgotPassword");

        // type in test user email and click submit
        cy.get("@testUserData").then((testUser) => {
            cy.get("#ForgotForm").find("input").type(testUser.email);
        });
        cy.get("#ForgotForm").find("button[type='submit']").click();

        // manually go to resetPassword page (this would be a link from the email the user recieved)
        cy.visit("/resetPassword/fakeToken/fakeKey");

        // type in the same test user and password as before (staying consistent with later tests that expect these data)
        cy.get("#RegForm").should("exist");
            cy.get("@testUserData").then((testUser) => {
            cy.get("#RegForm").find("input#Password").type(testUser.password);
            cy.get("#RegForm").find("input#confirm").type(testUser.password);
        });
        cy.get("#RegForm").find("button[type='submit']").click();

        // redirect to home page, should be logged in
        cy.wait("@authCallback", {requestTimeout: 10000});
        cy.url().should("match", /\/$/);
        cy.get("button").contains(/üdvözlünk/i).should("exist");
      });
    });