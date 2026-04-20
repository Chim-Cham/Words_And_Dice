namespace wndgame;
public static class WordLengthResolver
{
    public static (int min, int max) GetWordLengthRange(int level)
    {
        if (level < 1 || level > 25)
            throw new ArgumentException($"Ogiltigt level: {level}. Måste vara mellan 1 och 25.");

        if (level <= 10) return (3, 4);
        if (level <= 20) return (5, 6);
        return (7, 9);
    }
}