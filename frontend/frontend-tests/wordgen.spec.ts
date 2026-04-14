import { test, expect } from '@playwright/test';

test('loads a random word and reveals exactly two letters', async ({ page }) => {
  // Väntar först på alla backend calls
  await page.route('http://localhost:5164/api/word/*/*', async route => {
    const mockResponse = [
      {
        word: "tiger",
        category: "animals",
        length: 5
      }
    ];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });

  // Laddar startsidan
  await page.goto('http://localhost:5173/');

  // För att komma till gamepage
  await page.getByRole('button', { name: 'Invite player' }).click();
  await page.getByRole('button', { name: 'Continute to Game' }).click();

  // Själva GamePage är vid detta tillfället laddat och hämtar ut ett ord
  await expect(page.getByText('Loading word...')).toBeHidden();

  // Kollar så att kategorin stämmer
  await expect(page.getByText('Category: animals')).toBeVisible();

  // Kollar så att det finns rätt antal platser för ordet
  const slots = page.locator('.word-blank-slot');
  await expect(slots).toHaveCount(5);

  const slotValues = await slots.allTextContents();
  const revealedLetters = slotValues.filter(x => x.trim() !== '');

  expect(revealedLetters.length).toBe(2);

  for (const letter of revealedLetters) {
    expect("TIGER").toContain(letter);
  }
});