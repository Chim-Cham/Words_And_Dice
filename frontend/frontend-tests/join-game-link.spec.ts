import { test, expect } from '@playwright/test';

test('User can join a game via invite link', async ({ page }) => {
  const MOCK_GAME_ID = 'mock-guid-1234';

  await page.route(`**/api/games/${MOCK_GAME_ID}/players?name=*`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-player-2-id',
        gameId: MOCK_GAME_ID,
        playerName: 'PlaywrightJoiner',
        score: 0,
        isRoundReady: false
      })
    });
  });

  await page.route(`**/api/games/${MOCK_GAME_ID}`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: MOCK_GAME_ID,
        status: 'waiting',
        targetWord: 'TEST',
        category: 'Test',
        winningScore: 100,
        currentRound: 1
      })
    });
  });

  await page.route(`**/api/games/${MOCK_GAME_ID}/players`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'host-id', playerName: 'HostPlayer', score: 0 },
        { id: 'mock-player-2-id', playerName: 'PlaywrightJoiner', score: 0 }
      ])
    });
  });

  await page.goto(`http://localhost:5173/join/${MOCK_GAME_ID}`);

  await expect(page.getByText("You're Invited to a game!")).toBeVisible();

  await page.getByPlaceholder('Choose your Username').fill('PlaywrightJoiner');
  await page.getByRole('button', { name: 'Start Playing' }).click();

  await expect(page.getByRole('heading', { name: /Player 2/i })).toBeVisible();
});