using Xunit;
using wndgame;

namespace backend.Tests;

public class GameServiceIntegrationTests
{
    [Fact]
    public async Task CreateGame_ShouldPersistPlayerNameInDatabase()
    {
        // Arrange
        var service = new GameService();
        string playerName = "Mikael_Test";

        // Act
        var game = await service.CreateGame(playerName);

        var playersInGame = await service.GetPlayersInGame(game.Id);

        Assert.NotNull(game.Id);
        Assert.Equal("", game.TargetWord);
        Assert.Equal(100, game.WinningScore);
        Assert.Equal("waiting", game.Status);
        Assert.Equal(1, game.CurrentRound);

        // Assert - Spelaren
        Assert.Single(playersInGame);

        var firstPlayer = playersInGame[0];
        Assert.Equal(playerName, firstPlayer.PlayerName);
        Assert.Equal(0, firstPlayer.Score);
        Assert.False(firstPlayer.IsRoundReady);
    }
}