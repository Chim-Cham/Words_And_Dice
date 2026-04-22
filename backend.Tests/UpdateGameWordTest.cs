using Xunit;
using wndgame;

namespace backend.Tests;

// Testar att UpdateGameWord sparar och skriver över ord och kategori korrekt
public class UpdateGameWordTest
{
    [Fact]
    public async Task UpdateGameWord_ShouldPersistWordAndCategory()
    {
        // Ord och kategori ska sparas och kunna hämtas tillbaka via GetGameById
        var service = new GameService();
        var game = await service.CreateGame("Player1");

        await service.UpdateGameWord(game.Id, "DRAGON", "fantasy");

        var updated = await service.GetGameById(game.Id);
        Assert.Equal("DRAGON", updated!.TargetWord);
        Assert.Equal("fantasy", updated.Category);
    }

    [Fact]
    public async Task UpdateGameWord_ShouldOverwritePreviousWord()
    {
        // Det senaste anropet ska skriva över det tidigare ordet och kategorin
        var service = new GameService();
        var game = await service.CreateGame("Player1");

        await service.UpdateGameWord(game.Id, "FIRST", "test");
        await service.UpdateGameWord(game.Id, "SECOND", "animals");

        var updated = await service.GetGameById(game.Id);
        Assert.Equal("SECOND", updated!.TargetWord);
        Assert.Equal("animals", updated.Category);
    }
}
