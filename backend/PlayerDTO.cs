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