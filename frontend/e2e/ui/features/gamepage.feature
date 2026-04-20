Feature: Game page

    Scenario: User can open the GamePage
        Given I open the GamePage
        Then I should see the level
        And I should see Player 1
        And I should see Player 2
        And I should see the button "Confirm Word"

    Scenario: User sees the initial no-points message
        Given I open the GamePage
        Then I should see the text "You don't have any points yet, Earn points in the game first."

    Scenario: User sees an error message for a wrong answer
        Given I open the GamePage
        When I type "DOG" in the word input
        And I click the button "Confirm Word"
        Then I should see the text "Wrong answer, try again!"

    Scenario: User can give the correct answer
        Given I open the GamePage
        When I type "CAT" in the word input
        And I click the button "Confirm Word"
        Then I should see the text "Correct! +5 points"
        And I should see the text "Waiting for Player 2..."

    Scenario: User gets points and waits for next level
        Given I open the GamePage
        When I type "CAT" in the word input
        And I click the button "Confirm Word"
        Then I should see the text "Points: 5"
        And I should see the text "Waiting for Player 2..."