"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
test_1.test.describe('GamePage Timer Flow', function () {
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // 1. Install clock to control time-based tests
                return [4 /*yield*/, page.clock.install()];
                case 1:
                    // 1. Install clock to control time-based tests
                    _c.sent();
                    // 2. Mock the Player Creation (When joining the game)
                    return [4 /*yield*/, page.route('**/api/games/*/players?name=*', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, route.fulfill({
                                            status: 201,
                                            contentType: 'application/json',
                                            body: JSON.stringify({ id: 'player-123', gameId: 'game-456' })
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    // 2. Mock the Player Creation (When joining the game)
                    _c.sent();
                    // 3. Mock the Players list (Fetched by GamePage useEffect)
                    return [4 /*yield*/, page.route('**/api/games/*/players', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, route.fulfill({
                                            status: 200,
                                            contentType: 'application/json',
                                            body: JSON.stringify([
                                                { id: 'player-123', playerName: 'TestSpelaren', score: 0 },
                                                { id: 'player-999', playerName: 'Motståndaren', score: 0 }
                                            ])
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    // 3. Mock the Players list (Fetched by GamePage useEffect)
                    _c.sent();
                    // 4. Mock the Word API (Crucial to bypass "Loading word..." screen)
                    return [4 /*yield*/, page.route('**/api/word/*/*', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, route.fulfill({
                                            status: 200,
                                            contentType: 'application/json',
                                            body: JSON.stringify([
                                                { word: 'PLAYWRIGHT', category: 'programming_languages', length: 10 }
                                            ])
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    // 4. Mock the Word API (Crucial to bypass "Loading word..." screen)
                    _c.sent();
                    // 5. Navigation Flow
                    return [4 /*yield*/, page.goto('http://localhost:5173')];
                case 5:
                    // 5. Navigation Flow
                    _c.sent();
                    // Start Page
                    return [4 /*yield*/, page.getByPlaceholder('Username').fill('TestSpelaren')];
                case 6:
                    // Start Page
                    _c.sent();
                    // Click the button to go to Join Page
                    return [4 /*yield*/, page.getByRole('button', { name: 'Join Game' }).click()];
                case 7:
                    // Click the button to go to Join Page
                    _c.sent();
                    // Join Page
                    return [4 /*yield*/, page.getByPlaceholder('Enter Game ID').fill('game-456')];
                case 8:
                    // Join Page
                    _c.sent();
                    // Click the actual Join button
                    return [4 /*yield*/, page.getByRole('button', { name: 'Join Game', exact: true }).click()];
                case 9:
                    // Click the actual Join button
                    _c.sent();
                    // 6. Wait for the game to load (Loading screen -> Game content)
                    // We expect the 'Level 1 / 25' to appear once the word is fetched
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Level 1 / 25')).toBeVisible()];
                case 10:
                    // 6. Wait for the game to load (Loading screen -> Game content)
                    // We expect the 'Level 1 / 25' to appear once the word is fetched
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('Start at 45 sec at the start of the game', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, test_1.expect)(page.getByText('Time: 45s')).toBeVisible()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByPlaceholder('Type the word here...')).toBeEnabled()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Confirm Word' })).toBeEnabled()];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('Change color when its 10 sec left', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var timerBox;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Advance time by 35 seconds
                return [4 /*yield*/, page.clock.runFor(35000)];
                case 1:
                    // Advance time by 35 seconds
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Time: 10s')).toBeVisible()];
                case 2:
                    _c.sent();
                    timerBox = page.locator('.timer-box');
                    // Checking for the red color style applied in GamePage.tsx
                    return [4 /*yield*/, (0, test_1.expect)(timerBox).toHaveCSS('color', 'rgb(255, 0, 0)')];
                case 3:
                    // Checking for the red color style applied in GamePage.tsx
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('lock input field when the time is up', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Advance time by 45 seconds
                return [4 /*yield*/, page.clock.runFor(45000)];
                case 1:
                    // Advance time by 45 seconds
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Time: 0s')).toBeVisible()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Time is up!')).toBeVisible()];
                case 3:
                    _c.sent();
                    // Verify input and button are disabled via the isInputDisabled logic
                    return [4 /*yield*/, (0, test_1.expect)(page.getByPlaceholder('Type the word here...')).toBeDisabled()];
                case 4:
                    // Verify input and button are disabled via the isInputDisabled logic
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Confirm Word' })).toBeDisabled()];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
