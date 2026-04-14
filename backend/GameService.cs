namespace wndgame;

public class GameService
{
    //database
    private readonly Supabase.Client _client = SupabaseConfig.Instance;

    //create new game with game-id and player one with player-id
    public async Task<Game> CreateGame(string playerName)
    {
        var newGame = new Game
        {
            TargetWord = "",
            Status = "waiting",
            WinningScore = 100,
            CurrentRound = 1
        };

        var gameResponse = await _client.From<Game>().Insert(newGame);
        var insertedGame = gameResponse.Model!;

        var firstPlayer = new Player
        {
            GameId = newGame.Id,
            PlayerName = playerName,
            Score = 0,
            IsRoundReady = false
        };


        await _client.From<Player>().Insert(firstPlayer);

        return insertedGame;
    }

    //Joining a game (Player two)
    public async Task<Player> JoinGame(string gameId, string playerName)
    {

        var newPlayer = new Player
        {
            GameId = gameId,
            PlayerName = playerName,
            Score = 0,
            IsRoundReady = false
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

    public async Task<Player> SubmitRoundResult(string playerId, int newTotalScore)
    {
        var response = await _client
            .From<Player>()
            .Where(p => p.Id == playerId)
            .Get();

        var player = response.Model;

        if (player == null)
        {
            throw new Exception("Spelaren hittades inte.");
        }

        player.Score = newTotalScore;
        player.IsRoundReady = true;

        var updateResponse = await _client.From<Player>().Update(player);

        return updateResponse.Model!;
    }

    public async Task StartNextRound(string gameId)
    {
        var players = await GetPlayersInGame(gameId);

        foreach (var player in players)
        {
            player.IsRoundReady = false;
            // Om du har lagt till LastGuess, kan det vara bra att tömma den här också
            player.LastGuess = null;

            await _client.From<Player>().Update(player);
        }

        //Tanka in ett nytt ord i spelet???
        /*
        var gameResponse = await _client.From<Game>().Where(g => g.Id == gameId).Get();
        var game = gameResponse.Model;
        if (game != null) 
        {
            game.TargetWord = "NYTT_SLUMPAT_ORD";
            await _client.From<Game>().Update(game);
        }
        */
    }
    // Väntar på att båda spelarna ska vara redo
    public async Task<bool> IsGameReady(string gameId)
    {
        var players = await GetPlayersInGame(gameId);
        return players.Count == 2;
    }

    public async Task UpdateGameWord(string gameId, string word, string category)
    {
        var response = await _client.From<Game>().Where(g => g.Id == gameId).Get();
        var game = response.Model;

        if (game != null)
        {
            game.TargetWord = word;
            game.Category = category;
            await _client.From<Game>().Update(game);
        }
    }

    public async Task<Game?> GetGameById(string gameId)
    {
        var response = await _client
            .From<Game>()
            .Where(x => x.Id == gameId)
            .Get();

        return response.Models.FirstOrDefault();
    }
}

