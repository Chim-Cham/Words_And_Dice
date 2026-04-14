import { test, expect } from '@playwright/test';

test.describe('GamePage Timer Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.clock.install();

    await page.route('**/api/games/*/players?name=*', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'player-123', gameId: 'game-456' })
      });
    });

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

    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join game' }).click();
    await page.getByPlaceholder('Enter Game ID').fill('game-456');
    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

    await expect(page.getByText('Level 1 / 25')).toBeVisible();
  });

  test('Start at 45 sec at the start of the game', async ({ page }) => {
    await expect(page.getByText('Time: 45s')).toBeVisible();
    await expect(page.getByPlaceholder('Type the word here...')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeEnabled();
  });

  test('Change color when its 10 sec left', async ({ page }) => {
    await page.clock.runFor(35000);

    await expect(page.getByText('Time: 10s')).toBeVisible();

    const timerBox = page.locator('.timer-box');
    await expect(timerBox).toHaveCSS('color', 'rgb(255, 0, 0)');
  });

  test('lock input field when the time is up', async ({ page }) => {
    await page.clock.runFor(45000);

    await expect(page.getByText('Time: 0s')).toBeVisible();
    await expect(page.getByText('Time is up!')).toBeVisible();

    await expect(page.getByPlaceholder('Type the word here...')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeDisabled();
  });

});