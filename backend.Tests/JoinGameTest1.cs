using Xunit;
using wndgame;

namespace backend.Tests;

public class JoinGameTest
{

    [Fact]
    public async Task JoinGame_AddSecondPlayerExistingGame()
    {
        var service = new GameService();
        var game = await service.CreateGame("HÄST", "Spelare 1");

        var secondPlayer = await service.JoinGame(game.Id!, "Spelare 2");

        var allPlayers = await service.GetPlayersInGame(game.Id!);

        Assert.Equal(2, allPlayers.Count);
        Assert.Contains(allPlayers, p => p.PlayerName == "Spelare 1");
        Assert.Contains(allPlayers, p => p.PlayerName == "Spelare 2");

        Assert.Equal(0, secondPlayer.Score);
        Assert.False(secondPlayer.IsRoundReady);
        Assert.Equal(game.Id, secondPlayer.GameId);
    }
}
