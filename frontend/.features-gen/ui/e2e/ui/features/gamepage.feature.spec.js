// Generated from: e2e\ui\features\gamepage.feature
import { test } from "playwright-bdd";

test.describe('Game page', () => {

  test('User can open the GamePage', async ({ Given, Then, And, page }) => { 
    await Given('I open the GamePage', null, { page }); 
    await Then('I should see the level', null, { page }); 
    await And('I should see Player 1', null, { page }); 
    await And('I should see Player 2', null, { page }); 
    await And('I should see the button "Confirm Word"', null, { page }); 
  });

  test('User sees the initial no-points message', async ({ Given, Then, page }) => { 
    await Given('I open the GamePage', null, { page }); 
    await Then('I should see the text "You don\'t have any points yet, Earn points in the game first."', null, { page }); 
  });

  test('User sees an error message for a wrong answer', async ({ Given, When, Then, And, page }) => { 
    await Given('I open the GamePage', null, { page }); 
    await When('I type "DOG" in the word input', null, { page }); 
    await And('I click the button "Confirm Word"', null, { page }); 
    await Then('I should see the text "Wrong answer, try again!"', null, { page }); 
  });

  test('User can give the correct answer', async ({ Given, When, Then, And, page }) => { 
    await Given('I open the GamePage', null, { page }); 
    await When('I type "CAT" in the word input', null, { page }); 
    await And('I click the button "Confirm Word"', null, { page }); 
    await Then('I should see the text "Correct! +5 points"', null, { page }); 
    await And('I should see the button "Next Level"', null, { page }); 
  });

  test('User gets points and moves to the next level', async ({ Given, When, Then, And, page }) => { 
    await Given('I open the GamePage', null, { page }); 
    await When('I type "CAT" in the word input', null, { page }); 
    await And('I click the button "Confirm Word"', null, { page }); 
    await And('I click the button "Next Level"', null, { page }); 
    await Then('I should see the text "Level 2 / 25"', null, { page }); 
    await And('I should see the points "Points: 5"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\gamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the GamePage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I should see the level","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I should see Player 1","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I should see Player 2","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I should see the button \"Confirm Word\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Confirm Word\"","children":[{"start":25,"value":"Confirm Word","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I open the GamePage","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"You don't have any points yet, Earn points in the game first.\"","stepMatchArguments":[{"group":{"start":22,"value":"\"You don't have any points yet, Earn points in the game first.\"","children":[{"start":23,"value":"You don't have any points yet, Earn points in the game first.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":19,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given I open the GamePage","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I type \"DOG\" in the word input","stepMatchArguments":[{"group":{"start":7,"value":"\"DOG\"","children":[{"start":8,"value":"DOG","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"And I click the button \"Confirm Word\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Confirm Word\"","children":[{"start":20,"value":"Confirm Word","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"Wrong answer, try again!\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Wrong answer, try again!\"","children":[{"start":23,"value":"Wrong answer, try again!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":26,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":27,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I open the GamePage","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I type \"CAT\" in the word input","stepMatchArguments":[{"group":{"start":7,"value":"\"CAT\"","children":[{"start":8,"value":"CAT","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And I click the button \"Confirm Word\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Confirm Word\"","children":[{"start":20,"value":"Confirm Word","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"Correct! +5 points\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Correct! +5 points\"","children":[{"start":23,"value":"Correct! +5 points","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":31,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And I should see the button \"Next Level\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Next Level\"","children":[{"start":25,"value":"Next Level","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":34,"pickleLine":27,"tags":[],"steps":[{"pwStepLine":35,"gherkinStepLine":28,"keywordType":"Context","textWithKeyword":"Given I open the GamePage","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When I type \"CAT\" in the word input","stepMatchArguments":[{"group":{"start":7,"value":"\"CAT\"","children":[{"start":8,"value":"CAT","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":37,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"And I click the button \"Confirm Word\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Confirm Word\"","children":[{"start":20,"value":"Confirm Word","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"And I click the button \"Next Level\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Next Level\"","children":[{"start":20,"value":"Next Level","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"Level 2 / 25\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Level 2 / 25\"","children":[{"start":23,"value":"Level 2 / 25","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":40,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And I should see the points \"Points: 5\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Points: 5\"","children":[{"start":25,"value":"Points: 5","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end