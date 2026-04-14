import { test, expect, type Route } from '@playwright/test';

test.describe('Multiplayer word generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('joining a game shows mocked word and category', async ({ page }) => {
    await page.route('**/api/games/*/players?name=*', async (route: Route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'fejk-player-uuid-123',
          gameId: 'mitt-test-id',
          playerName: 'TestSpelaren',
          score: 0,
          lastGuess: null,
          isRoundReady: false
        })
      });
    });

    await page.route('**/api/games/*/players', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'host-uuid-999', playerName: 'Hosten', score: 0 },
          { id: 'fejk-player-uuid-123', playerName: 'TestSpelaren', score: 0 }
        ])
      });
    });

    await page.route('**/api/games/mitt-test-id', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mitt-test-id',
          status: 'waiting',
          targetWord: 'tiger',
          category: 'animals',
          winningScore: 100,
          currentRound: 1
        })
      });
    });

    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join game' }).click();

    await page.getByPlaceholder('Enter Game ID').fill('mitt-test-id');

    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

    await expect(page.getByText('Level 1 / 25')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Player 2' })).toBeVisible();

    await expect(page.getByText('Category: animals')).toBeVisible();

    const slots = page.locator('.word-blank-slot');
    await expect(slots).toHaveCount(5);

    const slotValues = await slots.allTextContents();
    const revealedLetters = slotValues.filter(x => x.trim() !== '');

    expect(revealedLetters.length).toBe(2);

    for (const letter of revealedLetters) {
      expect('TIGER').toContain(letter.toUpperCase());
    }
  });
});