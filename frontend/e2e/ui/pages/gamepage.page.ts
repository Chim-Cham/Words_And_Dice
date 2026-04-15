import { expect, Page } from "@playwright/test";

export class GamePage {
  constructor(private page: Page) { }

  async open() {
    // 1. Mocka API-anropet för ordet innan vi navigerar in i spelet.
    // Detta garanterar att spelet laddas omedelbart i pipelinen utan en riktig backend.
    await this.page.route("**/api/word/*/*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ word: "CAT", category: "Animals", length: 3 }]),
      });
    });

    // 2. Gå till startsidan
    await this.page.goto("/");

    // 3. Logga in (Krävs för att Host-knappen ska aktiveras)
    await this.page.getByPlaceholder("Username").fill("PlaywrightUser");
    await this.page.getByRole("button", { name: "Host Game" }).click();

    // 4. Vänta tills laddningsskärmen är borta och spelplanen faktiskt syns.
    // Vi väntar på kategoriboxen eftersom den indikerar att currentWord har laddats.
    await this.page.locator(".category-box").waitFor({ state: "visible", timeout: 15000 });
  }

  async expectLevelVisible() {
    // Använder regex för att hantera flexibla mellanslag i "Level 1 / 25"
    await expect(this.page.getByText(/Level 1 \/ 25/i)).toBeVisible();
  }

  async expectPlayer1HeadingVisible() {
    // Matchar "Player 1" oavsett om det står "(You)" efteråt
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
    // Vi väntar på att inputfältet är redo för att undvika "flaky" tester
    await input.waitFor({ state: "visible" });
    await input.fill(word);
  }

  async clickButton(buttonName: string) {
    // Klickar på knappen (t.ex. "Confirm Word" eller "Next Level")
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectTextVisible(text: string) {
    // exact: false är viktigt här för att hantera dolda radbrytningar eller punkter
    await expect(this.page.getByText(text, { exact: false })).toBeVisible({ timeout: 10000 });
  }

  async expectPointsVisible(pointsText: string) {
    // Hittar poäng oavsett exakt formatering
    await expect(
      this.page.getByText(pointsText, { exact: false }),
    ).toBeVisible();
  }
}