import { describe } from "vitest";
import { testsForBestsellers } from "./homePage.bestsellers";
import { testsForBookReviews } from "./homePage.bookReviews";

describe("Home Page", () => {
  testsForBestsellers();
  testsForBookReviews();
});
