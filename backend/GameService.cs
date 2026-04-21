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

        return response.Models ?? new List<Player>();
    }
    //Game list
    public async Task<List<Game>> GetAllGames()
    {
        var response = await _client.From<Game>().Get();
        return response.Models ?? new List<Game>();
    }

    public async Task<Player> SubmitRoundResult(string playerId, int newTotalScore)
    {
        var response = await _client
            .From<Player>()
            .Where(p => p.Id == playerId)
            .Get();

        var player = response.Models?.FirstOrDefault();

        if (player == null)
        {
            throw new Exception("Spelaren hittades inte.");
        }

        player.Score = newTotalScore;
        player.IsRoundReady = true;

        var updateResponse = await _client.From<Player>().Update(player);

        return updateResponse.Models.First();
    }

    public async Task StartNextRound(string gameId)
    {
        var players = await GetPlayersInGame(gameId);

        foreach (var player in players)
        {
            player.IsRoundReady = false;
            player.LastGuess = null;
            await _client.From<Player>().Update(player);
        }

        var gameResponse = await _client.From<Game>().Where(g => g.Id == gameId).Get();
        var game = gameResponse.Models?.FirstOrDefault();
        if (game != null)
        {
            game.CurrentRound += 1;
						game.TargetWord = "";
            await _client.From<Game>().Update(game);
        }

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
        var game = response.Models?.FirstOrDefault();

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

        return response.Models?.FirstOrDefault();
    }

    public async Task<GuessResult> SubmitGuess(string gameId, string playerId, string guess)
    {
        // hämtar spelet
        var gameResponse = await _client
        .From<Game>()
        .Where(g => g.Id == gameId)
        .Get();

        var game = gameResponse.Models?.FirstOrDefault();
        if (game == null)
            throw new Exception("Spelet hittades inte.");

        // hämtar spelaren
        var playerResponse = await _client
        .From<Player>()
        .Where(p => p.Id == playerId)
        .Get();

        var player = playerResponse.Models?.FirstOrDefault();
        if (player == null)
            throw new Exception("Spelaren hittades inte.");

        // jämför gissning
        bool correct = guess.ToUpper() == game.TargetWord.ToUpper();
        int scoreChange = correct ? +5 : -5;

        // uppdaterar resultat
        player.Score += scoreChange;
        player.LastGuess = guess;
        await _client.From<Player>().Update(player);

        // returnerar resultat
        return new GuessResult
        {
            Correct = correct,
            ScoreChange = scoreChange,
            NewScore = player.Score
        };
    }
}

