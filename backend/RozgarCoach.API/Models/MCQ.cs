namespace RozgarCoach.API.Models;

public class MCQ
{
    public int QuestionNumber { get; set; }
    public string Question { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int CorrectOptionIndex { get; set; }
    public string Explanation { get; set; } = string.Empty;
}

public class MCQSet
{
    public string JobCategory { get; set; } = string.Empty;
    public string Language { get; set; } = "english";
    public List<MCQ> Questions { get; set; } = new();
}

public class QuestionsBankRequest
{
    public string JobCategory { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "intermediate";
    public string Language { get; set; } = "both";
}
