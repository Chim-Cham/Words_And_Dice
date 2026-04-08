public class GameService
{
    private readonly Supabase.Client _client = SupabaseConfig.Instance;

    public async Task<Game> CreateGame(string word, string playerName)
    {
        var newGame = new Game
        {
            TargetWord = word.ToUpper(),
            CurrentDisplay = new string('_', word.Length),
            Status = "waiting",
            ActivePlayerId = null
        };

        var gameResponse = await _client.From<Game>().Insert(newGame);
        var insertedGame = gameResponse.Model!;

        var firstPlayer = new Player
        {
            GameId = newGame.Id,
            PlayerName = playerName,
            TurnOrder = 0
        };


        var playerResponse = await _client.From<Player>().Insert(firstPlayer);
        var insertedPlayer = playerResponse.Model!;

        insertedGame.ActivePlayerId = insertedPlayer.Id;
        var finalUpdate = await _client.From<Game>().Update(insertedGame);

        return finalUpdate.Model!;

        //newGame.ActivePlayerId = firstPlayer.Id;

        //await _client.From<Game>().Insert(newGame);
        //await _client.From<Player>().Insert(firstPlayer);

        //return newGame;
    }

    public async Task<List<Game>> GetAllGames()
    {
        var response = await _client.From<Game>().Get();
        return response.Models;
    }
}

//Detta är bara ett exemple på hur man hade kunnat göra en grund. utveckla detta när vi bygger upp spel miljön och har api till ord.