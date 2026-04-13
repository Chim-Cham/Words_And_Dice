using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class CreateGameApi
{
    public static void CreateGameStart(this IEndpointRouteBuilder app)
    {
        // Create game
        app.MapPost("/api/games", async (string name, GameService gameService) =>
        {
            try
            {
                var game = await gameService.CreateGame(name);

                var result = new GameDto
                {
                    Id = game.Id,
                    Status = game.Status,
                    TargetWord = game.TargetWord,
                    WinningScore = game.WinningScore
                };

                return Results.Created($"/api/games/{result.Id}", result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return Results.Problem("Kunde inte skapa spel i databasen.");
            }
        });
    }
}