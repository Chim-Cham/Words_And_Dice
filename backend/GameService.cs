namespace wndgame;

public class GameService
{
    //database
    private readonly Supabase.Client _client = SupabaseConfig.Instance;

    //create new game with game-id and player one with player-id
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
    }

    //Joining a game (Player two)
    public async Task<Player> JoinGame(string gameId, string playerName)
    {
        var existingPlayers = await GetPlayersInGame(gameId);

        var newPlayer = new Player
        {
            GameId = gameId,
            PlayerName = playerName,
            TurnOrder = existingPlayers.Count
        };

        var response = await _client.From<Player>().Insert(newPlayer);

        return response.Model!;
    }
    //player list
    public async Task<List<Player>> GetPlayersInGame(string gameId)
    {
        var response = await _client
            .From<Player>()
            .Where(x => x.GameId == gameId)
            .Get();

        return response.Models;
    }
    //Game list
    public async Task<List<Game>> GetAllGames()
    {
        var response = await _client.From<Game>().Get();
        return response.Models;
    }
}

//Detta är bara ett exemple på hur man hade kunnat göra en grund. utveckla detta när vi bygger upp spel miljön och har api till ord.