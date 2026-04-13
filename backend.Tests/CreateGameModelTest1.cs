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
        string testWord = "TESTORD";
        string playerName = "Mikael_Test";

        // Act
        var game = await service.CreateGame(testWord, playerName);

        var playersInGame = await service.GetPlayersInGame(game.Id);

        Assert.NotNull(game.Id);
        Assert.Equal(testWord, game.TargetWord);
        Assert.Equal(100, game.WinningScore);

        // Assert - Spelaren
        Assert.Single(playersInGame);

        var firstPlayer = playersInGame[0];
        Assert.Equal(playerName, firstPlayer.PlayerName);
        Assert.Equal(0, firstPlayer.Score);
        Assert.False(firstPlayer.IsRoundReady);
    }
}