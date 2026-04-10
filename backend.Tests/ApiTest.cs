using Xunit;
namespace backend.Tests;
using System.Text.Json;


public class ApiTest
{

    private readonly HttpClient _client;

    [Fact]
    public async Task wordFetch()
    {
        // Fetch from API
        var response = await _client.GetAsync("/api/word/animals/5");

        // Check fetch was succesful
        response.EnsureSuccessStatusCode();

        // Converts the fetched Json data into a string format
        var content = await response.Content.ReadAsStringAsync();
        var words = JsonSerializer.Deserialize<string>(content);

        System.Console.WriteLine(words);

        // Checks if the fetch was not null or empty
        Assert.NotNull(words);
        Assert.NotEmpty(words);
    }
}
