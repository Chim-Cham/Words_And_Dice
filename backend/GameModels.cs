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

    [Column("current_display")]
    public string CurrentDisplay { get; set; } = "";

    [Column("active_player_id")]
    public string? ActivePlayerId { get; set; }
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

    [Column("turn_order")]
    public int TurnOrder { get; set; }
}

//basic setup to get all needed data. 