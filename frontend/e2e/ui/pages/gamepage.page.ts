import { expect, Page } from "@playwright/test";

export class GamePage {
  constructor(private page: Page) {}

  async open() {
    // Sätt fasta ID:n så att appen vet exakt vem som är vem
    const MOCK_GAME_ID = "test-game-id";
    const MOCK_PLAYER_ID = "player-1";

    await this.page.route("**/api/games/*/players", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: MOCK_PLAYER_ID,
            playerName: "PlaywrightUser",
            score: 0,
            isRoundReady: false,
          },
          {
            id: "player-2",
            playerName: "Spelare2",
            score: 0,
            isRoundReady: false,
          },
        ]),
      });
    });

    // 2. Mocka: Spara ordet till backenden - måste vara före games**
    await this.page.route("**/api/games/*/word", async (route) => {
      await route.fulfill({ status: 200, body: "OK" });
    });

    // 3. Mocka: Polling på spelet
    await this.page.route(`**/api/games/${MOCK_GAME_ID}`, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: MOCK_GAME_ID,
            status: "playing",
            targetWord: "CAT",
            category: "animals",
            winningScore: 100,
            currentRound: 1,
          }),
        });
      } else {
        await route.fallback();
      }
    });

    // 4. Mocka: Skapa spelet (Host Game)
    await this.page.route("**/api/games**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: MOCK_GAME_ID,
            status: "waiting",
            targetWord: "",
            winningScore: 100,
            currentRound: 1,
          }),
        });
      } else {
        await route.fallback();
      }
    });

    // 5. Mocka: Hämta ord baserat på level
    await this.page.route("**/api/word/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ word: "cat", category: "animals" }),
      });
    });

    // 6. Mocka: Submit round
    await this.page.route("**/api/players/*/submit-round**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Score updated" }),
      });
    });

    // Kör UI-stegen
    await this.page.goto("/");
    await this.page.getByPlaceholder("Username").fill("PlaywrightUser");
    await this.page.getByRole("button", { name: "Host Game" }).click();

    // Nu kan vi vänta på kategoriboxen, alla nätverksanrop kommer besvaras direkt!
    await this.page
      .locator(".category-box")
      .waitFor({ state: "visible", timeout: 15000 });
  }

  async expectLevelVisible() {
    // Använder regex för att hantera flexibla mellanslag i "Level 1 / 25"
    await expect(this.page.getByText(/Level 1 \/ 25/i)).toBeVisible();
  }

  async expectPlayer1HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: /PlaywrightUser/i }),
    ).toBeVisible();
  }

  async expectPlayer2HeadingVisible() {
    await expect(
      this.page.getByRole("heading", { name: /Spelare2/i }),
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
    await expect(
      this.page.getByText(text, { exact: false }).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectPointsVisible(pointsText: string) {
    // Hittar poäng oavsett exakt formatering
    await expect(
      this.page.getByText(pointsText, { exact: false }),
    ).toBeVisible();
  }
}
