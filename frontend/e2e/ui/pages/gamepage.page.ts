import { expect, Page } from "@playwright/test";

export class GamePage {
  constructor(private page: Page) { }

  async open() {
    // Sätt fasta ID:n så att appen vet exakt vem som är vem
    const MOCK_GAME_ID = "test-game-id";
    const MOCK_PLAYER_ID = "player-1";

    // 1. Mocka: Skapa spelet ("Host Game" klicket)
    // Fångar anrop till /api/games oavsett query-parametrar
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
            playerId: MOCK_PLAYER_ID // Matchar spelarlistan nedan!
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 2. Mocka: Hämta spelarlistan (så hasLoadedPlayers blir sant)
    await this.page.route("**/api/games/*/players", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: MOCK_PLAYER_ID, playerName: "PlaywrightUser", score: 0 },
          { id: "player-2", playerName: "Spelare2", score: 0 } // Bra för UI-testerna att ha en Player 2!
        ]),
      });
    });

    // 3. Mocka: Hämta ett slumpmässigt ord
    await this.page.route("**/api/word/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ word: "CAT", category: "Animals", length: 3 }),
      });
    });

    // 4. Mocka: Spara ordet till backenden
    await this.page.route("**/api/games/*/word", async (route) => {
      await route.fulfill({ status: 200, body: "OK" });
    });

    // 5. Mocka: Pollingen (GET på själva spelet, fångar upp ifall React fastnar)
    await this.page.route(`**/api/games/${MOCK_GAME_ID}`, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: MOCK_GAME_ID,
            status: "playing",
            targetWord: "CAT",
            category: "Animals",
            winningScore: 100,
            currentRound: 1
          })
        });
      } else {
        await route.continue();
      }
    });

    await this.page.route("**/api/players/*/submit-round**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Score updated" })
      });
    });

    // Kör UI-stegen
    await this.page.goto("/");
    await this.page.getByPlaceholder("Username").fill("PlaywrightUser");
    await this.page.getByRole("button", { name: "Host Game" }).click();

    // Nu kan vi vänta på kategoriboxen, alla nätverksanrop kommer besvaras direkt!
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
    await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  }

  async expectPointsVisible(pointsText: string) {
    // Hittar poäng oavsett exakt formatering
    await expect(
      this.page.getByText(pointsText, { exact: false }),
    ).toBeVisible();
  }
}