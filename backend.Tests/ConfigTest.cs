using Xunit;

namespace backend.Tests;

public class ConfigTest
{

    [Fact]
    public void SupabaseConfigLoadEnv()
    {
        // Given
        var client = SupabaseConfig.Instance;
        // When
        Assert.NotNull(client);
        Assert.False(string.IsNullOrEmpty(SupabaseConfig.LoadedUrl), "SUPABASE_URL saknas i .env-filen.");
        Assert.False(string.IsNullOrEmpty(SupabaseConfig.LoadedKey), "SUPABASE_KEY saknas i .env-filen.");
        // Then
        Assert.Contains("supabase.co", SupabaseConfig.LoadedUrl);
    }
}