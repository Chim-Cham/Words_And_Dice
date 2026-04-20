// import { test, expect } from '@playwright/test';

// test.describe('GamePage Timer Flow', () => {

//   test.beforeEach(async ({ page }) => {

//     // =========================================================
//     // 1. SKOTTSÄKER NÄTVERKSMOCK (Fångar ALLT till din backend)
//     // =========================================================
//     await page.route('http://localhost:5164/api/**', async (route) => {
//       const method = route.request().method();
//       const url = route.request().url();

//       // A) Hantera CORS (Webbläsarens säkerhetskoll som annars kan krascha spelet)
//       if (method === 'OPTIONS') {
//         return route.fulfill({
//           status: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': '*',
//             'Access-Control-Allow-Headers': '*'
//           }
//         });
//       }

//       // B) Klicket på "Join Game" (När React gör POST till /players)
//       if (method === 'POST' && url.includes('/players')) {
//         return route.fulfill({
//           status: 200,
//           contentType: 'application/json',
//           body: JSON.stringify({
//             id: 'player-B', // "B" gör att du automatiskt blir Player 2 (efter A)
//             gameId: 'game-456',
//             playerName: 'TestSpelaren',
//             score: 0
//           })
//         });
//       }

//       // C) Hämtning av spelarlista i GamePage (Polling)
//       if (method === 'GET' && url.endsWith('/players')) {
//         return route.fulfill({
//           status: 200,
//           contentType: 'application/json',
//           body: JSON.stringify([
//             { id: 'player-A', playerName: 'Motståndaren', score: 0, isRoundReady: false },
//             { id: 'player-B', playerName: 'TestSpelaren', score: 0, isRoundReady: false }
//           ])
//         });
//       }

//       // D) Hämtning av spelets status (Här skickar vi ordet!)
//       if (method === 'GET' && url.includes('game-456')) {
//         return route.fulfill({
//           status: 200,
//           contentType: 'application/json',
//           body: JSON.stringify({
//             id: 'game-456',
//             status: 'playing',
//             targetWord: 'PLAYWRIGHT',
//             category: 'Testing',
//             winningScore: 100,
//             currentRound: 1
//           })
//         });
//       }

//       // E) Fallback för alla andra anrop så appen inte fastnar
//       return route.fulfill({ status: 200, body: 'OK' });
//     });


//     // =========================================================
//     // 2. NAVIGERING (Klickar sig fram i UI:t)
//     // =========================================================
//     await page.goto('http://localhost:5173/');

//     // Start Page
//     await page.getByPlaceholder('Username').fill('TestSpelaren');
//     // Använder regex /join/i för att klicka på StartPage oavsett om det står "Join game" eller "Join Game"
//     await page.getByRole('button', { name: /join/i }).click();

//     // Join Page (Enligt din nya kod)
//     await page.getByPlaceholder('Enter Game ID').fill('game-456');
//     await page.getByRole('button', { name: 'Join Game' }).click();

//     // =========================================================
//     // 3. VERIFIERING & TIDSKONTROLL
//     // =========================================================

//     // Vi MÅSTE vänta på att GamePage faktiskt laddar in förbi "Loading word..."
//     await expect(page.getByPlaceholder('Type the word here...')).toBeVisible({ timeout: 10000 });

//     // FÖRST NÄR inmatningsfältet syns tar Playwright över systemklockan!
//     await page.clock.install();
//   });


//   // =========================================================
//   // TESTERNA FÖR SPELET
//   // =========================================================

//   test('Start at 45 sec at the start of the game', async ({ page }) => {
//     await expect(page.getByText('Time: 45s')).toBeVisible();
//     await expect(page.getByPlaceholder('Type the word here...')).toBeEnabled();
//     await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeEnabled();
//   });

//   test('Change color when its 10 sec left', async ({ page }) => {
//     // Spola fram tiden 35 sekunder (45 - 35 = 10)
//     await page.clock.runFor(35000);

//     // Verifiera att klockan står på 10s
//     await expect(page.getByText('Time: 10s')).toBeVisible();

//     // Verifiera att din CSS-färg slår in
//     const timerBox = page.locator('.timer-box');
//     await expect(timerBox).toHaveCSS('color', 'rgb(255, 0, 0)');
//   });

//   test('lock input field when the time is up', async ({ page }) => {
//     // Spola fram tiden hela vägen (45 sekunder)
//     await page.clock.runFor(45000);

//     // Klockan är 0 och texten byts
//     await expect(page.getByText('Time: 0s')).toBeVisible();
//     await expect(page.getByText('Time is up!')).toBeVisible();

//     // Fältet och knappen avaktiveras
//     await expect(page.getByPlaceholder('Type the word here...')).toBeDisabled();
//     await expect(page.getByRole('button', { name: 'Confirm Word' })).toBeDisabled();
//   });

// });