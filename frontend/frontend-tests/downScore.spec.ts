import { test, expect } from '@playwright/test';

test.describe('DownScore Flow (wrong answer gives -5)', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/games/*/players?name=*', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'player-123',
          gameId: 'game-456',
          playerName: 'TestSpelaren',
          score: 0
        })
      });
    });

    await page.route('**/api/games/*/players', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'player123', playerName: 'TestSpelaren', score: 0
          },
          {
            id: 'player999', playerName: 'Motståndaren', score: 0
          }
        ])
      });
    });

    await page.route('**/api/games/game-456', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'game-456',
          status: 'waiting',
          targetWord: 'TIGER',
          category: 'animals',
          winningScore: 100,
          currentRound: 1
        })
      });
    });

    await page.route('**/api/games/*/guess', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          correct: false,
          scoreChange: -5,
          newScore: -5
        })
      });
    });

    await page.goto('http://localhost:5173');

    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

    await page.getByPlaceholder('Enter game ID').fill('game-456');
    await page.getByRole('button', { name: 'Join Game', exact: true }).click();

    await expect(page.getByText('Level 1 / 25')).toBeVisible();
  });

  test('wrong answer should give -5 points and show error message', async ({ page }) => {
    await page.getByPlaceholder('Type the word here...').fill('WRONG');
    await page.getByRole('button', { name: 'Confirm word' }).click();

    await expect(page.getByText('Wrong answer! -5 points')).toBeVisible();

    await page.route('**/api/games/*/players', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'player123',
            gameId: 'game-456',
            playerName: 'TestSpelaren',
            score: 0,
            lastGuess: null,
            isRoundReady: false
          },
          {
            id: 'player999',
            gameId: 'game-456',
            playerName: 'Motståndaren',
            score: 0,
            lastGuess: null,
            isRoundReady: false
          }
        ])
      });
    });

    await expect(page.getByTestId('-5')).toBeVisible();
  });

});