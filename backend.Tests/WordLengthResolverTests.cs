using Xunit;
using wndgame;

namespace backend.Tests;

// Testa rätt ordlängd returneras baserat på level
public class WordLengthResolverTests
{
  [Theory]
  [InlineData(1, 3, 4)]
  [InlineData(5, 3, 4)]
  [InlineData(6, 5, 5)]
  [InlineData(10, 5, 5)]
  public void GetWordLengthRange_Level1To10_Returns3To4or5(int level, int expectedMin, int expectedMax)
  {
    var (min, max) = WordLengthResolver.GetWordLengthRange(level);
    Assert.Equal(expectedMin, min);
    Assert.Equal(expectedMax, max);
  }

  [Theory]
  [InlineData(11, 6, 6)]
  [InlineData(15, 6, 6)]
  [InlineData(16, 6, 7)]
  [InlineData(20, 6, 7)]
  public void GetWordLengthRange_Level11To20_Returns6To7(int level, int expectedMin, int expectedMax)
  {
    var (min, max) = WordLengthResolver.GetWordLengthRange(level);
    Assert.Equal(expectedMin, min);
    Assert.Equal(expectedMax, max);
  }

  [Theory]
  [InlineData(21, 7, 12)]
  [InlineData(23, 7, 12)]
  [InlineData(25, 7, 12)]
  public void GetWordLengthRange_Level21To25_Returns7To12(int level, int expectedMin, int expectedMax)
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