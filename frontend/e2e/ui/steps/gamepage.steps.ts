import { createBdd } from "playwright-bdd";
import { GamePage } from "../pages/gamepage.page";

const { Given, When, Then } = createBdd();

Given("I open the GamePage", async ({ page }) => {
  const gamePage = new GamePage(page);
  await gamePage.open();
});

Then("I should see the level", async ({ page }) => {
  const gamePage = new GamePage(page);
  await gamePage.expectLevelVisible();
});

Then("I should see Player 1", async ({ page }) => {
  const gamePage = new GamePage(page);
  await gamePage.expectPlayer1HeadingVisible();
});

Then("I should see Player 2", async ({ page }) => {
  const gamePage = new GamePage(page);
  await gamePage.expectPlayer2HeadingVisible();
});

Then(
  "I should see the button {string}",
  async ({ page }, buttonName: string) => {
    const gamePage = new GamePage(page);
    await gamePage.expectButtonVisible(buttonName);
  },
);

When("I type {string} in the word input", async ({ page }, word: string) => {
  const gamePage = new GamePage(page);
  await gamePage.typeWord(word);
});

When("I click the button {string}", async ({ page }, buttonName: string) => {
  const gamePage = new GamePage(page);
  await gamePage.clickButton(buttonName);
});

Then("I should see the text {string}", async ({ page }, text: string) => {
  const gamePage = new GamePage(page);
  await gamePage.expectTextVisible(text);
});

Then(
  "I should see the points {string}",
  async ({ page }, pointsText: string) => {
    const gamePage = new GamePage(page);
    await gamePage.expectPointsVisible(pointsText);
  },
);
