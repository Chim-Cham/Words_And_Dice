using Supabase;
using dotenv.net;

public static class SupabaseConfig
{
    private static Client? _instance;
    public static string? LoadedUrl { get; private set; }
    public static string? LoadedKey { get; private set; }

    public static Client Instance
    {
        get
        {
            if (_instance == null)
            {
                DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] { "db-config.env" }));

                LoadedUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
                LoadedKey = Environment.GetEnvironmentVariable("SUPABASE_KEY");

                if (string.IsNullOrEmpty(LoadedKey) || string.IsNullOrEmpty(LoadedKey))
                {
                    throw new Exception("Could not find the data in .env");
                }

                _instance = new Client(LoadedUrl, LoadedUrl);
            }
            return _instance;
        }
    }
}