using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace wndgame;

public static class RoundApi
{
    public static void RoundApiStart(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/players/{playerId}/submit-round", async (string playerId, int newScore, GameService gameService) =>
        {
            try
            {
                var updatedPlayer = await gameService.SubmitRoundResult(playerId, newScore);
                return Results.Ok(updatedPlayer);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });

        app.MapPost("/api/games/{gameId}/next-round", async (string gameId, GameService gameService) =>
        {
            try
            {
                await gameService.StartNextRound(gameId);
                return Results.Ok(new { message = "Next round started. Players reset." });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });

        app.MapPost("/api/games/{gameId}/word", async (string gameId, ApiWord wordDto, GameService gameService) =>
        {
            await gameService.UpdateGameWord(gameId, wordDto.word, wordDto.category);
            return Results.Ok();
        });

        app.MapPost("/api/games/{gameId}/guess", async (string gameId, GuessRequest req, GameService gameService) =>
        {
            if (string.IsNullOrWhiteSpace(req.Guess))
            {
                return Results.BadRequest(new { error = "Guess cannot be empty." });
            }
            try
            {
                var result = await gameService.SubmitGuess(gameId, req.PlayerId, req.Guess);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });

        app.MapPost("/api/games/{gameId}/ready/{playerId}", async (string gameId, string playerId, GameService gameService) =>
        {
            try
            {
                await gameService.MarkPlayerReady(gameId, playerId);
                return Results.Ok(new { message = "Player marked as ready." });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}