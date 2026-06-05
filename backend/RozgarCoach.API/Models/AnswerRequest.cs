namespace RozgarCoach.API.Models;

public class AnswerRequest
{
    public string JobCategory { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string UserAnswer { get; set; } = string.Empty;
    public string Language { get; set; } = "english";
    public int QuestionNumber { get; set; } = 1;
}
