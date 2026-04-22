import { test, expect } from '@playwright/test';

test.describe('Correct Word Display Spec', () => {
  const MOCK_GAME_ID = 'reveal-test-id';
  const MOCK_WORD = 'TIGER';

  test.beforeEach(async ({ page }) => {
    // Mock:ar fram ett spel
    await page.route('**/api/games/*/players?name=*', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'player-123',
          gameId: MOCK_GAME_ID,
          playerName: 'TestSpelaren',
          score: 0
        })
      });
    });

    await page.route(`**/api/games/${MOCK_GAME_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: MOCK_GAME_ID,
          status: 'waiting',
          targetWord: MOCK_WORD,
          category: 'animals',
          currentRound: 1
        })
      });
    });

    await page.route(`**/api/games/${MOCK_GAME_ID}/players`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'host-1', playerName: 'Host', score: 0 },
          { id: 'player-123', playerName: 'TestSpelaren', score: 0 }
        ])
      });
    });

    // Mock:ar ord-generatorn
    await page.route(/.*\/api\/word\/.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ word: MOCK_WORD, category: 'animals', length: 5 })
      });
    });

    // Navigerar och join:ar ett spel (yippie)
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join game' }).click();
    await page.getByPlaceholder('Enter Game ID').fill(MOCK_GAME_ID);
    await page.getByRole('button', { name: 'Join Game', exact: true }).click();
  });

  test('should reveal word after wrong guess and time runs out', async ({ page }) => {
    // Kollar så att vi är på gamepage:n
    await expect(page.getByText('Category: animals')).toBeVisible();

    // Installerar klocka om det inte redan finns
    try {
      await page.clock.install();
    } catch (e) {
      // already installed
    }

    // Gissar fel med vilje 
    const input = page.getByPlaceholder('Type the word here...');
    await input.fill('WRONG');
    await input.press('Enter');

    // Bekräftar att "Wrong Answer" visas på skärmen
    await expect(page.getByText(/Wrong answer/i)).toBeVisible();

    // Spolar fram tiden med 40 sekunder först och sedan med 6 sekunder
    await page.clock.runFor(40000);
    await page.clock.runFor(6000);

    // Bekräftar att "Time is up" texten visas
    await expect(page.getByText('Time is up!')).toBeVisible();

    // Kollar efter CSS klassen och grejs-o-mojs
    const revealedContainer = page.locator('.revealed-word-text');
    await expect(revealedContainer).toBeVisible();
    await expect(revealedContainer).toContainText(`The word was: ${MOCK_WORD.toUpperCase()}`);
  });
});