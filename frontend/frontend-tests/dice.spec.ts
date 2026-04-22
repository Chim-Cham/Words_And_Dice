import { test, expect } from '@playwright/test';

async function setupGame(page: any, playerScore: number = 0) {


  await page.route(/\/api\/word\/[^/]+\/[^/]+/, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ word: "tiger", category: "animals", length: 5 })
    });
  });

  await page.route('**/api/games?name=*', async (route: any) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'test-game-id', status: 'waiting', targetWord: '', winningScore: 100 })
    });
  });

  await page.route('**/api/games/test-game-id', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test-game-id',
        status: 'waiting',
        targetWord: 'tiger',
        category: 'animals',
        currentRound: 1
      })
    });
  });

  await page.route('**/api/games/*/next-round', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ currentRound: 1 })
    });
  });

  await page.route('**/api/games/*/word', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ word: 'tiger', category: 'animals', length: 5 })
    });
  });

  await page.route('**/api/games/*/players', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'player-1', playerName: 'Spelare1', score: playerScore, isRoundReady: true },
        { id: 'player-2', playerName: 'Spelare2', score: 0, isRoundReady: true }
      ])
    });
  });

  await page.goto('http://localhost:5173/');
  await page.getByPlaceholder('Username').fill('TestSpelaren');
  await page.getByRole('button', { name: 'Host Game' }).click();
  await expect(page.getByText('Level 1 / 25')).toBeVisible({ timeout: 10000 });
}

test('dice-word-row renderas', async ({ page }) => {
  await setupGame(page, 0);
  await expect(page.locator('.dice-word-row')).toBeVisible();
});

test('hint cost matches word length', async ({ page }) => {
  await setupGame(page, 0);
  await expect(page.getByText('Hint cost: 5 points')).toBeVisible();
});

test('Buy Hint button is disabled when player has 0 points', async ({ page }) => {
  await setupGame(page, 0);
  await expect(page.getByRole('button', { name: 'Buy Hint' })).toBeDisabled();
});

test('warning message shown when player cannot afford hint', async ({ page }) => {
  await setupGame(page, 0);
  await expect(page.getByText(/don't have any points yet/i)).toBeVisible();
});

test('buying a hint adds a yellow die to the board', async ({ page }) => {
  await setupGame(page, 20);
  const hintDiceBefore = await page.locator('.die-face--hint').count();
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  await expect(page.locator('.die-face--hint')).toHaveCount(hintDiceBefore + 1);
});

test('buying a hint reduces player points by word length', async ({ page }) => {
  await setupGame(page, 20);
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  await expect(page.locator('.points-display-box')).toContainText('15');
});

test('hint die appears above a previously empty slot', async ({ page }) => {
  await setupGame(page, 20);
  const emptySlotsBefore = await page.locator('.word-slot:not(.word-slot--revealed)').count();
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  const emptySlotsAfter = await page.locator('.word-slot:not(.word-slot--revealed)').count();
  expect(emptySlotsAfter).toBe(emptySlotsBefore - 1);
});

test('buying two hints adds two yellow dice and deducts points twice', async ({ page }) => {
  await setupGame(page, 20);
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  await page.waitForTimeout(500);
  await expect(page.locator('.die-face--hint')).toHaveCount(1);
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  await page.waitForTimeout(500);
  await expect(page.locator('.die-face--hint')).toHaveCount(2);
  await expect(page.locator('.points-display-box')).toContainText('20');
});

test('dice are horizontally centered over their word slots after landing', async ({ page }) => {
  await setupGame(page, 0);
  await page.waitForTimeout(1600);

  const dice = page.locator('.die-face');
  const count = await dice.count();

  for (let i = 0; i < count; i++) {
    const dieBox = await dice.nth(i).boundingBox();
    if (!dieBox) throw new Error(`Missing die box at index ${i}`);

    // Find the parent slot column and get the slot within it
    const parentCol = dice.nth(i).locator('xpath=..');
    const slotBox = await parentCol.locator('.word-slot').boundingBox();
    if (!slotBox) throw new Error(`Missing slot box at index ${i}`);

    const dieCenterX = dieBox.x + dieBox.width / 2;
    const slotCenterX = slotBox.x + slotBox.width / 2;

    expect(Math.abs(dieCenterX - slotCenterX)).toBeLessThan(4);
  }
});

test('dice are vertically inside or overlapping their word slots after landing', async ({ page }) => {
  await setupGame(page, 0);
  await page.waitForTimeout(1600);

  const dice = page.locator('.die-face--settled');
  const slots = page.locator('.word-slot--revealed');
  const count = await dice.count();

  for (let i = 0; i < count; i++) {
    const dieBox = await dice.nth(i).boundingBox();
    const slotBox = await slots.nth(i).boundingBox();
    if (!dieBox || !slotBox) throw new Error(`Missing box at index ${i}`);

    const dieBottom = dieBox.y + dieBox.height;
    const slotBottom = slotBox.y + slotBox.height;
    const dieTop = dieBox.y;
    const slotTop = slotBox.y;

    // Die must overlap with the slot vertically
    const overlaps = dieTop < slotBottom && dieBottom > slotTop;
    expect(overlaps).toBe(true);
  }
});

test('hint die is horizontally centered over its word slot after buying', async ({ page }) => {
  await setupGame(page, 20);
  await page.getByRole('button', { name: 'Buy Hint' }).click();
  await page.waitForTimeout(1600);

  const hintDice = page.locator('.die-face--hint');
  const count = await hintDice.count();

  for (let i = 0; i < count; i++) {
    const dieBox = await hintDice.nth(i).boundingBox();
    if (!dieBox) throw new Error(`Missing hint die box at index ${i}`);

    const parentCol = hintDice.nth(i).locator('xpath=..');
    const slotBox = await parentCol.locator('.word-slot').boundingBox();
    if (!slotBox) throw new Error(`Missing slot box for hint die at index ${i}`);

    const dieCenterX = dieBox.x + dieBox.width / 2;
    const slotCenterX = slotBox.x + slotBox.width / 2;

    expect(Math.abs(dieCenterX - slotCenterX)).toBeLessThan(4);
  }
});