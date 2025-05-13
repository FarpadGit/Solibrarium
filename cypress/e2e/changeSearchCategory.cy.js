describe("Changing search category", () => {    
  it("should be able to change a searchbar from searching by title to searching by author", () => {
    cy.get("nav input").first().as("Searchbar");
    cy.get("@Searchbar").siblings(":has(img)").find("img").as("Icon");
    
    // Searchbar and Icon should indicate it will search by Title
    cy.get("@Searchbar").invoke("attr", "placeholder").should("match", /cím szerint/i);
    cy.get("@Icon").should("have.attr", "src", "/icons/title.svg");

    // types something in the searchbar
    cy.get("@Searchbar").type("test");
    cy.wait(1000);
    cy.url().should("include", "/search");

    // search result text should show a search by title
    cy.get("b").invoke("text").should("match", /cím: \"test\"/i);

    // click Settings button
    cy.get("button.settings_btn").click();
    cy.wait(1000);

    // click second option (by author)
    cy.get("label.settings_label").eq(1).click();
    
    // Searchbar and Icon should change to indicate it will search by author, search results should also change
    cy.get("@Searchbar").invoke("attr", "placeholder").should("match", /szerző szerint/i);
    cy.get("@Icon").should("have.attr", "src", "/icons/author.svg");
    cy.get("b").invoke("text").should("match", /szerző: \"test\"/i)
  });
});