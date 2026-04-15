import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('http://localhost:5164/api/word/*/*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ word: "tiger", category: "animals", length: 5 }])
    });
  });

  await page.route('**/api/games?name=*', async route => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'test-game-id', status: 'waiting', targetWord: '', winningScore: 100 })
    });
  });

  await page.route('**/api/games/*/players', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'player-1', playerName: 'Spelare1', score: 0 },
        { id: 'player-2', playerName: 'Spelare2', score: 0 }
      ])
    });
  });

  await page.goto('http://localhost:5173/');
  await page.getByPlaceholder('Username').fill('TestSpelaren');
  await page.getByRole('button', { name: 'Host Game' }).click();
  await expect(page.getByText('Loading word...')).toBeHidden({ timeout: 10000 });
});

test('dice-word-row renderas', async ({ page }) => {
  const row = page.locator('.dice-word-row');
  await expect(row).toBeVisible();
});
