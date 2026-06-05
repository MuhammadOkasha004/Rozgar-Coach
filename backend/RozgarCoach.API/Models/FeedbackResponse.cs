namespace RozgarCoach.API.Models;

public class FeedbackResponse
{
    public int OverallScore { get; set; }
    public int CommunicationScore { get; set; }
    public int TechnicalScore { get; set; }
    public int ConfidenceScore { get; set; }
    public int RelevanceScore { get; set; }
    public List<string> StrongPoints { get; set; } = new();
    public List<string> ImprovementAreas { get; set; } = new();
    public string DetailedFeedback { get; set; } = string.Empty;
    public string IdealAnswer { get; set; } = string.Empty;
    public int QuestionScore { get; set; }
}
