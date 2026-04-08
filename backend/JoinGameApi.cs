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
                return Results.Created($"/api/games/{gameId}/players/{player.Id}", player);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}