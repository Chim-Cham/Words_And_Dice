import { test, expect } from '@playwright/test';

test.describe('GamePage Timer Flow', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Install clock to control time-based tests
    await page.clock.install();

    // 2. Mock the Player Creation (When joining the game)
    await page.route('**/api/games/*/players?name=*', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'player-123', gameId: 'game-456' })
      });
    });

    // 3. Mock the Players list (Fetched by GamePage useEffect)
    await page.route('**/api/games/*/players', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'player-123', playerName: 'TestSpelaren', score: 0 },
          { id: 'player-999', playerName: 'Motståndaren', score: 0 }
        ])
      });
    });

    // 4. Mock the Word API (Crucial to bypass "Loading word..." screen)
    await page.route('**/api/word/*/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { word: 'PLAYWRIGHT', category: 'programming_languages', length: 10 }
        ])
      });
    });

    // 5. Navigation Flow
    await page.goto('http://localhost:5173');

    // Start Page
    await page.getByPlaceholder('Username').fill('TestSpelaren');
    // Click the button to go to Join Page
    await page.getByRole('button', { name: 'Join Game' }).click();

    // Join Page
    await page.getByPlaceholder('Enter Game ID').fill('game-456');
    // Click the actual Join button
    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

    // 6. Wait for the game to load (Loading screen -> Game content)
    // We expect the 'Level 1 / 25' to appear once the word is fetched
    await expect(page.getByText('Level 1 / 25')).toBeVisible();
  });

  test('Start at 45 sec at the start of the game', async ({ page }) => {
    await expect(page.getByText('Time: 45s')).toBeVisible();
    await expect(page.getByPlaceholder('Type the word here...')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeEnabled();
  });

  test('Change color when its 10 sec left', async ({ page }) => {
    // Advance time by 35 seconds
    await page.clock.runFor(35000);

    await expect(page.getByText('Time: 10s')).toBeVisible();

    const timerBox = page.locator('.timer-box');
    // Checking for the red color style applied in GamePage.tsx
    await expect(timerBox).toHaveCSS('color', 'rgb(255, 0, 0)');
  });

  test('lock input field when the time is up', async ({ page }) => {
    // Advance time by 45 seconds
    await page.clock.runFor(45000);

    await expect(page.getByText('Time: 0s')).toBeVisible();
    await expect(page.getByText('Time is up!')).toBeVisible();

    // Verify input and button are disabled via the isInputDisabled logic
    await expect(page.getByPlaceholder('Type the word here...')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeDisabled();
  });
});