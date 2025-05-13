describe("Buying books", () => {    
  it("should buy 2 books using the search page and find it under the user's Account page", () => {
    cy.intercept("/api/auth/callback/SolibrariumProvider").as("authCallback");
    cy.intercept("/api/auth/session").as("authSessionCall");

    // get a list of books to pick from by clicking on the Fantasy quick link
    cy.get("#QuickLinks a").contains(/fantasy/i).click();
    cy.url().should("include", "/search");
    cy.wait(2000);

    // filter out books you can't purchase
    cy.get("button.filters_btn").click();
    cy.get("label[for='priceFilter']").click();
    cy.wait(1000);

    // save the ID of the first two books by reading their href links and click the Add to Cart buttons
    // (every card has two links, one on the thumbnail and one on the title, we only care about one of each)
    cy.get("a[href^='/details/']").eq(0).invoke("attr", "href").then((href) => {cy.wrap(href.split('/details/')[1]).as('BookID1')});
    cy.get("a[href^='/details/']").eq(2).invoke("attr", "href").then((href) => {cy.wrap(href.split('/details/')[1]).as('BookID2')});
    cy.get("button").not("[disabled]").contains(/kosárba/i).click();
    cy.get("button").not("[disabled]").contains(/kosárba/i).click();

    // open shopping cart
    cy.get("button#Cart-btn").click();
    cy.wait(500);
    // should have those two books in shopping cart
    cy.get("@BookID1").then((bookID1) => {
      cy.get(".cart_item").eq(0).find("a").should("have.attr", "href", "/details/" + bookID1);
    });
    cy.get("@BookID2").then((bookID2) => {
      cy.get(".cart_item").eq(1).find("a").should("have.attr", "href", "/details/" + bookID2);
    });
    cy.get("button").contains(/tovább/i).click();

    // navigate to Checkout page
    cy.url().should("include", "checkout");
    // should have those two books in checkout
    cy.get("@BookID1").then((bookID1) => {
      cy.get(".checkout_item").eq(0).find("a").should("have.attr", "href", "/details/" + bookID1);
    });
    cy.get("@BookID2").then((bookID2) => {
      cy.get(".checkout_item").eq(1).find("a").should("have.attr", "href", "/details/" + bookID2);
    });
    cy.get("button").contains(/tovább/i).click().wait(2000);

    // log in with test user at login modal
    cy.url().should("include", "login");
    cy.get("[aria-modal='true']").as("modal");
    cy.get("@testUserData").then((testUser) => {
      cy.get("@modal").getByLabel("Email cím").type(testUser.email);
      cy.get("@modal").getByLabel("Jelszó").type(testUser.password);
    });
    cy.get("@modal").find("button[type='submit']").click();
    cy.wait("@authCallback", {requestTimeout: 15000});

    // click Next button again after login
    cy.url().should("include", "checkout");
    cy.get("button").contains(/tovább/i).click();
    cy.wait("@authSessionCall").wait(2000);
    cy.url().should("match", /\/$/);

    // navigate to Account page
    cy.get("button").contains(/üdvözlünk/i).click().wait(200);
    cy.get("[role='option']").contains(/könyveim/i).click().wait(1000);

    // should find the two purchased books
    cy.url().should("include", "account");
    cy.get(".userbook").should("have.length", 2);
    cy.get("@BookID1").then((bookID1) => {
      cy.get(".userbook").eq(0).find("input").should("have.id", bookID1);
    });
    cy.get("@BookID2").then((bookID2) => {
      cy.get(".userbook").eq(1).find("input").should("have.id", bookID2);
    });
  });
});