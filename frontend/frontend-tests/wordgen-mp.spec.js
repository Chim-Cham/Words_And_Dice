import { test, expect } from '@playwright/test';
test.describe('Multiplayer word generation', () => {
    test('joining a game shows mocked word and category', async ({ page }) => {
        await page.route('**/api/games/*/players?name=*', async (route) => {
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
        await page.route('**/api/games/*/players', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'host-uuid-999', playerName: 'Hosten', score: 0, isRoundReady: false },
                    { id: 'fejk-player-uuid-123', playerName: 'TestSpelaren', score: 0, isRoundReady: false }
                ])
            });
        });
        await page.route('**/api/word/*/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { word: 'tiger', category: 'animals', length: 5 }
                ])
            });
        });
        await page.route('**/api/games/mitt-test-id', async (route) => {
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
        // New
        await page.goto('http://localhost:5173');
        await page.getByPlaceholder('Username').fill('TestSpelaren');
        await page.getByRole('button', { name: 'Join Game' }).click();
        await page.getByPlaceholder('Enter Game ID').fill('mitt-test-id');
        await page.getByRole('button', { name: 'Join Game', exact: true }).click();
        await expect(page.getByText('Level 1 / 25')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Player 2' })).toBeVisible();
        await expect(page.getByText('Category: animals')).toBeVisible();
        // Kollar antalet tomrum för bokstäverna samt att endast två ledtrådar ges
        const slots = page.locator('.word-slot');
        await expect(slots).toHaveCount(5);
        const dieFaces = page.locator('.die-face');
        await page.waitForTimeout(2000);
        const revealedLetters = await dieFaces.allTextContents();
        expect(revealedLetters.length).toBe(2);
        for (const letter of revealedLetters) {
            expect('TIGER').toContain(letter.toUpperCase());
        }
    });
});
