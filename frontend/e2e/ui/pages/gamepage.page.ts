import { expect, Page } from "@playwright/test";

export class GamePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("/");
    await this.page.getByRole("button", { name: "Invite player" }).click();
    await this.page.getByRole("button", { name: /Continute to Game/i }).click();
  }

  async expectLevelVisible() {
    await expect(this.page.getByText("Level 1 / 25")).toBeVisible();
  }

  async expectPlayer1HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: "Player 1" }),
    ).toBeVisible();
  }

  async expectPlayer2HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: "Player 2" }),
    ).toBeVisible();
  }

  async expectButtonVisible(buttonName: string) {
    await expect(
      this.page.getByRole("button", { name: buttonName }),
    ).toBeVisible();
  }

  async typeWord(word: string) {
    await this.page.getByPlaceholder("Type the word here...").fill(word);
  }

  async clickButton(buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }

  async expectPointsVisible(pointsText: string) {
    await expect(
      this.page.getByText(pointsText, { exact: true }),
    ).toBeVisible();
  }
}
