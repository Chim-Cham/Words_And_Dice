import { test, expect } from '@playwright/test';

test.describe('GamePage Input Logic (Enter-knapp/button)', () => {

  test.beforeEach(async ({ page }) => {
    // Använder Tiger som "Mock" ord
    await page.route('**/api/word/*/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ word: "TIGER", category: "animals", length: 5 }])
      });
    });

    // Mock runda och spelare
    await page.route('**/api/games/*/players', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'p1', playerName: 'Host', score: 0 },
          { id: 'p2', playerName: 'TestSpelaren', score: 0 }
        ])
      });
    });

    // Kollar om poäng 'POST':funkar
    await page.route('**/api/players/*/submit-round*', async route => {
      await route.fulfill({ status: 200 });
    });

    // Gå till spelet
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('Username').fill('TestSpelaren');
    await page.getByRole('button', { name: 'Host Game' }).click();

    // Väntar på att spelet ska ladda
    await expect(page.getByText('Category: animals')).toBeVisible();
  });

  test('pressing Enter with the correct word submits successfully', async ({ page }) => {
    const input = page.getByPlaceholder('Type the word here...');

    // Skriver det korrekta ordet
    await input.fill('TIGER');

    // Trycker på "ENTER" på tangentbordet
    await input.press('Enter');

    // Kontrollerar UI:n
    await expect(page.getByText('Correct! +5 points')).toBeVisible();
    await expect(page.getByText('Waiting for Player 2...')).toBeVisible();

    // Kontrollerar att inputs "stängs av" efter att Enter-tryckts
    await expect(input).toBeDisabled();
  });

  test('pressing Enter with a wrong word shows error message', async ({ page }) => {
    const input = page.getByPlaceholder('Type the word here...');

    // Skriver Fel ord
    await input.fill('LIONS');

    // Trycker på ENTER-knappen
    await input.press('Enter');

    // Fel-ord meddelande dyker up
    await expect(page.getByText('Wrong answer, try again!')).toBeVisible();

    // Kontrollerar så att spelaren fortfarande kan mata in nya bokstäver (för att gissa igen)
    await expect(input).toBeEnabled();
  });

  test('pressing Enter with empty input does nothing', async ({ page }) => {
    const input = page.getByPlaceholder('Type the word here...');

    // Kollar att input-fältet är tomt
    await input.focus();
    await page.keyboard.press('Enter');

    // Kollar så att spelet inte går vidare om spelaren trycker enter med ett tomt svars-fält
    await expect(page.getByText('Waiting for Player')).not.toBeVisible();
    await expect(page.getByText('Wrong answer')).not.toBeVisible();
  });
});