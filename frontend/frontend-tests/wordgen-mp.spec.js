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
test_1.test.describe('Multiplayer word generation', function () {
    test_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('http://localhost:5173')];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('joining a game shows mocked word and category', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var slots, dieFaces, revealedLetters, _i, revealedLetters_1, letter;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.route('**/api/games/*/players?name=*', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, route.fulfill({
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
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, page.route('**/api/games/*/players', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, route.fulfill({
                                            status: 200,
                                            contentType: 'application/json',
                                            body: JSON.stringify([
                                                { id: 'host-uuid-999', playerName: 'Hosten', score: 0 },
                                                { id: 'fejk-player-uuid-123', playerName: 'TestSpelaren', score: 0 }
                                            ])
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, page.route('**/api/games/mitt-test-id', function (route) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, route.fulfill({
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
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, page.getByPlaceholder('Username').fill('TestSpelaren')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, page.getByRole('button', { name: 'Join game' }).click()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, page.getByPlaceholder('Enter Game ID').fill('mitt-test-id')];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, page.getByRole('button', { name: 'Join Game', exact: true }).click()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Level 1 / 25')).toBeVisible()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Player 2' })).toBeVisible()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Category: animals')).toBeVisible()];
                case 10:
                    _c.sent();
                    slots = page.locator('.word-slot');
                    return [4 /*yield*/, (0, test_1.expect)(slots).toHaveCount(5)];
                case 11:
                    _c.sent();
                    dieFaces = page.locator('.die-face');
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, dieFaces.allTextContents()];
                case 13:
                    revealedLetters = _c.sent();
                    (0, test_1.expect)(revealedLetters.length).toBe(2);
                    for (_i = 0, revealedLetters_1 = revealedLetters; _i < revealedLetters_1.length; _i++) {
                        letter = revealedLetters_1[_i];
                        (0, test_1.expect)('TIGER').toContain(letter.toUpperCase());
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
