var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<GameService>();

var app = builder.Build();

app.MapPost("/debug/create-game", async (string word, GameService gameService) =>
{
    var game = await gameService.CreateGame(word);
    return Results.Ok(game);
});

app.MapGet("/debug/games", async (GameService gameService) =>
{
    return Results.Ok(await gameService.GetAllGames());
});

app.Run();
