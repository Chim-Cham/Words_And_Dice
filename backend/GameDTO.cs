namespace wndgame;

public class GameDto
{
    public string Id { get; set; } = "";
    public string Status { get; set; } = "";
    public string TargetWord { get; set; } = "";
    public int WinningScore { get; set; }
    public int CurrentRound { get; set; }
    public string Category { get; set; } = "";
}