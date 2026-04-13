using Xunit;
namespace backend.Tests;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;

public class ApiTest
{


    [Fact]
    public async Task wordFetch()
    {
        using var fetch = new HttpClient();

        // Fetch from API
        // var response = await fetch.GetAsync("https://random-words-api.kushcreates.com/api?language=en&category=animals&length=5");
        var response = await fetch.GetAsync("http://localhost:5164/api/word/animals/5");


        // Check fetch was succesful
        response.EnsureSuccessStatusCode();

        // Converts the fetched Json data into a string format
        var content = await response.Content.ReadAsStringAsync();
        // var words = JsonSerializer.Deserialize<string>(content);

        System.Console.WriteLine(content);

        // Checks if the fetch was not null or empty
        Assert.NotNull(content);
        Assert.NotEmpty(content);
    }
}
