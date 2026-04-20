using Xunit;
using wndgame;

namespace backend.Tests;

// Testa rätt ordlängd returneras baserat på level
public class WordLengthResolverTests
{
    [Theory]
    [InlineData(1,  3, 4)]
    [InlineData(5,  3, 4)]
    [InlineData(10, 3, 4)]
    public void GetWordLengthRange_Level1To10_Returns3To4(int level, int expectedMin, int expectedMax)
    {
        var (min, max) = WordLengthResolver.GetWordLengthRange(level);
        Assert.Equal(expectedMin, min);
        Assert.Equal(expectedMax, max);
    }

    [Theory]
    [InlineData(11, 5, 6)]
    [InlineData(15, 5, 6)]
    [InlineData(20, 5, 6)]
    public void GetWordLengthRange_Level11To20_Returns5To6(int level, int expectedMin, int expectedMax)
    {
        var (min, max) = WordLengthResolver.GetWordLengthRange(level);
        Assert.Equal(expectedMin, min);
        Assert.Equal(expectedMax, max);
    }

    [Theory]
    [InlineData(21, 7, 9)]
    [InlineData(23, 7, 9)]
    [InlineData(25, 7, 9)]
    public void GetWordLengthRange_Level21To25_Returns7To9(int level, int expectedMin, int expectedMax)
    {
        var (min, max) = WordLengthResolver.GetWordLengthRange(level);
        Assert.Equal(expectedMin, min);
        Assert.Equal(expectedMax, max);
    }

    [Fact]
    public void GetWordLengthRange_Level0_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() => WordLengthResolver.GetWordLengthRange(0));
    }

    [Fact]
    public void GetWordLengthRange_Level26_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() => WordLengthResolver.GetWordLengthRange(26));
    }
}