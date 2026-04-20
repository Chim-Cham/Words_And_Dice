import { test, expect } from '@playwright/test';

test.describe('Join Game Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('need a username to join a game', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please enter a username first!');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Join Game' }).click();
  });

  test('able to nav to join game', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('TestSpelaren');

    await page.getByRole('button', { name: 'Join game' }).click();

    await expect(page.getByRole('heading', { name: 'Join Game' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter Game ID')).toBeVisible();
  });

  test('able to join game with valid game id', async ({ page }) => {

    await page.route('**/api/games/*/players?name=*', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'fejk-player-uuid-123',
          gameId: 'fejk-game-uuid-456',
          playerName: 'TestSpelaren',
          score: 0,
          lastGuess: null,
          isRoundReady: false
        })
      });
    });

    await page.route('**/api/word/*/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            word: "PLAYWRIGHT",
            category: "programming_languages",
            length: 10
          }
        ])
      });
    });

    await page.route('**/api/games/*/players', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'player-999', playerName: 'Host', score: 0 },
          { id: 'fejk-player-uuid-123', playerName: 'TestSpelaren', score: 0 }
        ])
      });
    });

    await page.route('**/api/games/mitt-test-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mitt-test-id',
          status: 'waiting',
          targetWord: 'PLAYWRIGHT',
          category: 'programming_languages',
          winningScore: 100,
          currentRound: 1
        })
      });
    });

    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join game' }).click();

    await page.getByPlaceholder('Enter Game ID').fill('mitt-test-id');

    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

  });

  test('go from join game back to start page', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join game' }).click();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

});