using Xunit;
namespace backend.Tests;

using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;

public class ApiTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTest(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task WordFetch_AnimalsLevel1_ReturnsWord()
    {
        // Testar nya endpoint-formatet: /api/word/{category}/level/{level}
        var response = await _client.GetAsync("/api/word/animals/level/1");

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();

        Assert.NotNull(content);
        Assert.NotEmpty(content);
    }

    [Fact]
    public async Task WordFetch_InvalidCategory_Returns400()
    {
        // Testar att ogiltig kategori ger 400
        var response = await _client.GetAsync("/api/word/fakecategory/level/1");

        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task WordFetch_Categories_ReturnsAllCategories()
    {
        // Testar att /api/word/categories returnerar en lista
        var response = await _client.GetAsync("/api/word/categories");

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var categories = JsonSerializer.Deserialize<List<string>>(content);

        Assert.NotNull(categories);
        Assert.Contains("animals", categories);
        Assert.Contains("brainrot", categories);
    }
}