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
    }
}