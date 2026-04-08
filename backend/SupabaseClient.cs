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
                var envPath = "db-config.env";

                if (!File.Exists(envPath))
                {
                    envPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "backend", "db-config.env");
                }

                if (File.Exists(envPath))
                {
                    dotenv.net.DotEnv.Load(options: new dotenv.net.DotEnvOptions(envFilePaths: new[] { envPath }));
                }

                LoadedUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
                LoadedKey = Environment.GetEnvironmentVariable("SUPABASE_KEY");

                if (string.IsNullOrEmpty(LoadedUrl) || string.IsNullOrEmpty(LoadedKey))
                {
                    throw new Exception("Could not find the data in .env");
                }

                _instance = new Client(LoadedUrl!, LoadedKey!);
            }
            return _instance;
        }
    }
}