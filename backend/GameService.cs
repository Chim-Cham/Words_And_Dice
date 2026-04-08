public class GameService
{
    private readonly Supabase.Client _client = SupabaseConfig.Instance;

    public async Task<Game> CreateGame(string word)
    {
        var newGame = new Game
        {
            TargetWord = word.ToUpper(),
            CurrentDisplay = new string('_', word.Length)
        };

        var response = await _client.From<Game>().Insert(newGame);
        return response.Model!;
    }

    public async Task<List<Game>> GetAllGames()
    {
        var response = await _client.From<Game>().Get();
        return response.Models;
    }
}

//Detta är bara ett exemple på hur man hade kunnat göra en grund. utveckla detta när vi bygger upp spel miljön och har api till ord.