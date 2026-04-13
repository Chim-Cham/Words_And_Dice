using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class CreateGameApi
{
    public static void CreateGameStart(this IEndpointRouteBuilder app)
    {
        // Create game
        app.MapPost("/api/games", async (string word, string name, GameService gameService) =>
        {
            var game = await gameService.CreateGame(word, name);
            return Results.Created($"/api/games/{game.Id}", game);
        });
    }
}