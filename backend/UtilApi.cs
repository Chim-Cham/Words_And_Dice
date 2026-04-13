using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class UtilApi
{
    public static void UtilApiStart(this IEndpointRouteBuilder app)
    {
        // List of all games
        app.MapGet("/api/games", async (GameService gameService) =>
        {
            return Results.Ok(await gameService.GetAllGames());
        });

        // All players in a specific game
        app.MapGet("/api/games/{gameId}/players", async (string gameId, GameService gameService) =>
        {
            var players = await gameService.GetPlayersInGame(gameId);
            return Results.Ok(players);
        });
    }
}