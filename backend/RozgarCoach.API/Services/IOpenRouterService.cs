using RozgarCoach.API.Models;

namespace RozgarCoach.API.Services;

public interface IOpenRouterService
{
    Task<string> GetNextQuestionAsync(QuestionRequest request);
    Task<FeedbackResponse> EvaluateAnswerAsync(AnswerRequest request);
    Task<MCQSet> GenerateQuestionsBankAsync(QuestionsBankRequest request);
}
