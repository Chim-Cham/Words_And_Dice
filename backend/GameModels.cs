using Postgrest.Attributes;
using Postgrest.Models;

namespace wndgame;

[Table("games")]
public class Game : BaseModel
{
    [PrimaryKey("id", shouldInsert: true)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("status")]
    public string Status { get; set; } = "waiting";

    [Column("target_word")]
    public string TargetWord { get; set; } = "";

    [Column("winning_score")]
    public int WinningScore { get; set; } = 100;
}

[Table("players")]
public class Player : BaseModel
{
    [PrimaryKey("id", shouldInsert: true)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("game_id")]
    public string GameId { get; set; } = "";

    [Column("player_name")]
    public string PlayerName { get; set; } = "";

    [Column("score")]
    public int Score { get; set; } = 0;

    [Column("last_guess")]
    public string? LastGuess { get; set; }

    [Column("is_round_ready")]
    public bool IsRoundReady { get; set; } = false;
}

//basic setup to get all needed data. 