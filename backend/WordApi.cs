namespace wndgame;
using System.Net.Http;

public static class WordAPI
{
    public static void WordGenerator(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/word/{category}/{length}", async (string category, int length) =>
        {
            using var fetch = new HttpClient();

            var wordFetch = await fetch.GetAsync
            ($"https://random-words-api.kushcreates.com/api?language=en&category={category}&length={length}");
            var content = await wordFetch.Content.ReadAsStringAsync();

            return Results.Content(content, "application/json");
        });
    }
}

