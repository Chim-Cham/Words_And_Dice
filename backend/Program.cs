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
// Create game enpoint
app.CreateGameStart();
// Join gameenpoint
app.JoinGameStart();
//Rounds
app.RoundApiStart();
//Util and admin endpoints 
app.UtilApiStart();


app.Run();
