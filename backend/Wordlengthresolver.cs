namespace wndgame;

public static class WordLengthResolver
{
  public static (int min, int max) GetWordLengthRange(int level)
  {
    if (level < 1 || level > 25)
      throw new ArgumentException($"Ogiltigt level: {level}. Måste vara mellan 1 och 25.");

    if (level <= 5) return (3, 4);
    if (level <= 10) return (5, 5);
    if (level <= 15) return (6, 6);
    if (level <= 20) return (6, 7);
    return (7, 12);
  }
}