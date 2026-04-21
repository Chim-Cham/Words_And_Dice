namespace wndgame;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

public static class WordAPI
{
    private static readonly HttpClient _http = new();

    // Hjälpklass för att deserialisera API-svaret
    private class WordResult
    {
        [JsonPropertyName("word")]
        public string Word { get; set; } = "";

        [JsonPropertyName("category")]
        public string Category { get; set; } = "";
    }

    // Alla kategorier som externa API:et stöder
    public static readonly List<string> SupportedCategories = new()
    {
        "wordle", "brainrot", "countries", "capitals", "sports",
        "animals", "birds", "softwares", "programming_languages",
        "games", "games-pc", "games-mobile", "games-console", "companies"
    };

    public static void WordGenerator(this WebApplication app)
    {
        // Gammal endpoint - används av frontend
        app.MapGet("/api/word/{category}/{length}", async (string category, int length) =>
        {
            var url = $"https://random-words-api.kushcreates.com/api?language=en&category={category}&length={length}&words=1";
            var response = await _http.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return Results.StatusCode((int)response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var results = JsonSerializer.Deserialize<List<WordResult>>(content);

            if (results == null || results.Count == 0)
                return Results.NotFound(new { error = $"Inga ord hittades." });

            return Results.Ok(results);
        });

        // Ny endpoint - filtrerar på level (1–25)
        app.MapGet("/api/word/{category}/level/{level}", async (string category, int level) =>
        {
            if (!SupportedCategories.Contains(category))
                return Results.BadRequest(new { error = $"Kategorin '{category}' stöds inte." });

            var (min, max) = WordLengthResolver.GetWordLengthRange(level);

            var random = new Random();
            int length = random.Next(min, max + 1);

            var url = $"https://random-words-api.kushcreates.com/api?language=en&category={category}&length={length}&words=1";
            var response = await _http.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return Results.StatusCode((int)response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var results = JsonSerializer.Deserialize<List<WordResult>>(content);

            if (results == null || results.Count == 0)
                return Results.NotFound(new { error = $"Inga ord hittades för kategori '{category}' på level {level}." });

            return Results.Ok(new { word = results[0].Word, category });
        });

        // Returnerar alla tillgängliga kategorier
        app.MapGet("/api/word/categories", () => Results.Ok(SupportedCategories));
    }
}