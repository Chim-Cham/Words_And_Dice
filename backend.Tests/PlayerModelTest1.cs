using Xunit;

namespace backend.Tests;

public class PlayerModelTests
{
    [Fact]
    public void Player_ShouldHaveCorrectNameWhenAssigned()
    {
        var expectedName = "Testsson";
        var player = new Player();

        player.PlayerName = expectedName;

        Assert.Equal(expectedName, player.PlayerName);
        Assert.NotNull(player.Id);
    }

    [Fact]
    public void Player_ShouldBeAssignedToSpecificGame()
    {
        var gameId = Guid.NewGuid().ToString();
        var player = new Player();

        player.GameId = gameId;

        Assert.Equal(gameId, player.GameId);
    }
}