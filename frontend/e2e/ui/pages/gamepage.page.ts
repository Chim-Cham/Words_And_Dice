import { expect, Page } from "@playwright/test";

export class GamePage {
  constructor(private page: Page) { }

  async open() {
    await this.page.goto("/");
    await this.page.getByPlaceholder("Username").fill("PlaywrightUser");
    await this.page.getByRole("button", { name: "Host Game" }).click();
    await expect(this.page.getByText("Loading word...")).not.toBeVisible({ timeout: 10000 });
  }

  async expectLevelVisible() {
    await expect(this.page.getByText(/Level 1 \/ 25/i)).toBeVisible();
  }
  async expectPlayer1HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: /Player 1/i }),
    ).toBeVisible();
  }

  async expectPlayer2HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: /Player 2/i }),
    ).toBeVisible();
  }

  async expectButtonVisible(buttonName: string) {
    await expect(
      this.page.getByRole("button", { name: buttonName }),
    ).toBeVisible();
  }

  async typeWord(word: string) {
    const input = this.page.getByPlaceholder("Type the word here...");
    await input.fill(word);
  }

  async clickButton(buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }

  async expectPointsVisible(pointsText: string) {
    await expect(
      this.page.getByText(pointsText, { exact: false }),
    ).toBeVisible();
  }
}