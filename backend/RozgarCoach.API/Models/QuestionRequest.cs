namespace RozgarCoach.API.Models;

public class QuestionRequest
{
    public string JobCategory { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "intermediate";
    public string Language { get; set; } = "english";
    public int QuestionNumber { get; set; } = 1;
    public List<ConversationMessage> History { get; set; } = new();
}
