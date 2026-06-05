namespace RozgarCoach.API.Models;

public class InterviewSession
{
    public string SessionId { get; set; } = Guid.NewGuid().ToString();
    public string JobCategory { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "intermediate";
    public string Language { get; set; } = "english";
    public List<ConversationMessage> History { get; set; } = new();
    public List<FeedbackResponse> FeedbackList { get; set; } = new();
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
