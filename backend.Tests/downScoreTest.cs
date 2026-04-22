using Xunit;
using wndgame;

namespace backend.Tests;

public class downScoreTest
{
  [Fact]
  public async Task WrongGuess_ShouldGiveMinusFivePoints()
  {
    // Arrange
    var service = new GameService();
    var game = await service.CreateGame("Player1");

    var players = await service.GetPlayersInGame(game.Id);
    var player = players.First();

    // targetWord
    await service.UpdateGameWord(game.Id, "APPLE", "fruit");

    // skicka fel gissning
    var result = await service.SubmitGuess(game.Id, player.Id, "BANANA");

    // Assert
    Assert.False(result.Correct);
    Assert.Equal(-5, result.ScoreChange);
    Assert.Equal(0, result.NewScore);
  }
}