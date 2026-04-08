using wndgame;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<GameService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

//Test Api endpoints
app.DebugStart();

/*Real API*/

// Create game
app.CreateGameStart();

// Join game
app.JoinGameStart();

app.UtilApiStart();


app.Run();
