namespace wndgame;

public class PlayerDto
{
    public string Id { get; set; } = "";
    public string GameId { get; set; } = "";
    public string PlayerName { get; set; } = "";
    public int Score { get; set; }
    public string? LastGuess { get; set; }
    public bool IsRoundReady { get; set; }
}

public class GuessRequest
{
    public string PlayerId { get; set; } = "";
    public string Guess { get; set; } = "";
}

public class GuessResult
{
    public bool Correct { get; set; }
    public int ScoreChange { get; set; }
    public int NewScore { get; set; }
}