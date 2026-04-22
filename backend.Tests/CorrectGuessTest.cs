using Xunit;
using wndgame;

namespace backend.Tests;

// Testar att SubmitGuess hanterar rätt gissning korrekt
public class CorrectGuessTest
{
    [Fact]
    public async Task CorrectGuess_ShouldGivePlusFivePoints()
    {
        // En rätt gissning ska ge +5 poäng och sätta NewScore till 5
        var service = new GameService();
        var game = await service.CreateGame("Player1");
        var players = await service.GetPlayersInGame(game.Id);
        var player = players.First();

        await service.UpdateGameWord(game.Id, "APPLE", "fruits");

        var result = await service.SubmitGuess(game.Id, player.Id, "APPLE");

        Assert.True(result.Correct);
        Assert.Equal(5, result.ScoreChange);
        Assert.Equal(5, result.NewScore);
    }

    [Fact]
    public async Task CorrectGuess_IsCaseInsensitive()
    {
        // Gissningen ska godkännas oavsett om bokstäverna är stora eller små
        var service = new GameService();
        var game = await service.CreateGame("Player1");
        var players = await service.GetPlayersInGame(game.Id);
        var player = players.First();

        await service.UpdateGameWord(game.Id, "APPLE", "fruits");

        var result = await service.SubmitGuess(game.Id, player.Id, "apple");

        Assert.True(result.Correct);
        Assert.Equal(5, result.ScoreChange);
    }
}
