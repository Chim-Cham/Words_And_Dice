using Xunit;
using wndgame;

namespace backend.Tests;

public class IsGameReadyTest
{
  [Fact]
  public async Task IsGameReady_ShouldReturnFalse_WhenOnlyOnePlayerExists()
  {
    var service = new GameService();
    var game = await service.CreateGame("Spelare A");

    var result = await service.IsGameReady(game.Id);
    Assert.False(result);
  }

  [Fact]
  public async Task IsGameReady_ShouldReturnTrue_WhenTwoPlayersExist()
  {
    var service = new GameService();
    var game = await service.CreateGame("Spelare A");
    await service.JoinGame(game.Id, "Spelare B");

    var result = await service.IsGameReady(game.Id);
    Assert.True(result);
  }
}