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
            var games = await gameService.GetAllGames();
            var gameDtos = games.Select(g => new GameDto
            {
                Id = g.Id,
                Status = g.Status,
                TargetWord = g.TargetWord,
                WinningScore = g.WinningScore
            }).ToList();

            return Results.Ok(gameDtos);
        });

        // All players in a specific game
        app.MapGet("/api/games/{gameId}/players", async (string gameId, GameService gameService) =>
        {
            var players = await gameService.GetPlayersInGame(gameId);
            var playerDtos = players.Select(p => new PlayerDto
            {
                Id = p.Id,
                GameId = p.GameId,
                PlayerName = p.PlayerName,
                Score = p.Score,
                LastGuess = p.LastGuess,
                IsRoundReady = p.IsRoundReady
            }).ToList();

            return Results.Ok(playerDtos);
        });

        app.MapGet("/api/games/{gameId}", async (string gameId, GameService gameService) =>
            {
                var game = await gameService.GetGameById(gameId);
                if (game == null)
                {
                    return Results.NotFound(new { error = "Spelet hittades inte." });
                }

                var result = new GameDto
                {
                    Id = game.Id,
                    Status = game.Status,
                    TargetWord = game.TargetWord,
                    WinningScore = game.WinningScore,
                    Category = game.Category
                };

                return Results.Ok(result);
            });
    }
}