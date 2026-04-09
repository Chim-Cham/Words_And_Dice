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

        var player = new Player
        {
            GameId = game.Id,
            PlayerName = playerName,
            TurnOrder = 1
        };

        var client = SupabaseConfig.Instance;
        var response = await client.From<Player>().Insert(player);

        // Assert
        Assert.NotNull(response.Model);
        Assert.Equal(playerName, response.Model.PlayerName);

        var fetchResponse = await client.From<Player>()
            .Where(p => p.Id == player.Id)
            .Get();

        Assert.Single(fetchResponse.Models);
        Assert.Equal(playerName, fetchResponse.Models[0].PlayerName);
    }
}