using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class JoinGameApi
{
    public static void JoinGameStart(this IEndpointRouteBuilder app)
    {
        // Join game
        app.MapPost("/api/games/{gameId}/players", async (string gameId, string name, GameService gameService) =>
        {
            try
            {
                var player = await gameService.JoinGame(gameId, name);

                var result = new PlayerDto
                {
                    Id = player.Id,
                    GameId = player.GameId,
                    PlayerName = player.PlayerName,
                    Score = player.Score,
                    LastGuess = player.LastGuess,
                    IsRoundReady = player.IsRoundReady
                };

                return Results.Created($"/api/games/{gameId}/players/{result.Id}", result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"JOIN ERROR: {ex.Message}");
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}