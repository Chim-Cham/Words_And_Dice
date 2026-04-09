using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class DebugApi
{
    public static void DebugStart(this IEndpointRouteBuilder app)
    {

        /*Test api*/
        app.MapPost("/debug/create-game", async (string word, string name, GameService gameService) =>
        {
            var game = await gameService.CreateGame(word, name);
            return Results.Ok(game);
        });

        app.MapGet("/debug/games", async (GameService gameService) =>
        {
            return Results.Ok(await gameService.GetAllGames());
        });

        app.MapPost("/debug/join-game", async (string gameId, string name, GameService gameService) =>
        {
            try
            {
                var player = await gameService.JoinGame(gameId, name);
                return Results.Ok(player);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });

        app.MapGet("/debug/games/{gameId}/players", async (string gameId, GameService gameService) =>
        {
            var players = await gameService.GetPlayersInGame(gameId);
            return Results.Ok(players);
        });
    }
}
