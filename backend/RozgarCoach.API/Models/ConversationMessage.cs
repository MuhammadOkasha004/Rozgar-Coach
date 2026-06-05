namespace RozgarCoach.API.Models;

public class ConversationMessage
{
    public string Role { get; set; } = string.Empty; // "user" | "assistant"
    public string Content { get; set; } = string.Empty;
}
