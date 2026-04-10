using Xunit;
using wndgame;

namespace backend.Tests;


public class TwoPlayerInGameTest
{
    [Fact]
    public async Task FullGame_TwoPlayersInSameGame()
    {
        var service = new GameService();
        string secretWord = "KODNING";

        var game = await service.CreateGame(secretWord, "Spelare A");

        var playerB = await service.JoinGame(game.Id, "Spelare B");

        var allPlayers = await service.GetPlayersInGame(game.Id);

        Assert.Equal(2, allPlayers.Count);

        var pA = allPlayers.First(p => p.PlayerName == "Spelare A");
        var pB = allPlayers.First(p => p.PlayerName == "Spelare B");

        Assert.Equal(game.Id, pA.GameId);
        Assert.Equal(game.Id, pB.GameId);

        Assert.Equal(0, pA.Score);
        Assert.Equal(0, pB.Score);
        Assert.False(pA.IsRoundReady);
        Assert.False(pB.IsRoundReady);
    }
}