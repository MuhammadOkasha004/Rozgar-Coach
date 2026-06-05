using Microsoft.AspNetCore.Mvc;
using RozgarCoach.API.Models;
using RozgarCoach.API.Services;

namespace RozgarCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IOpenRouterService _openRouterService;
    private readonly ILogger<FeedbackController> _logger;

    public FeedbackController(IOpenRouterService openRouterService, ILogger<FeedbackController> logger)
    {
        _openRouterService = openRouterService;
        _logger = logger;
    }

    [HttpPost("summary")]
    public async Task<IActionResult> GetSummary([FromBody] List<FeedbackResponse> feedbackList)
    {
        try
        {
            if (feedbackList == null || !feedbackList.Any())
                return BadRequest(new { error = "No feedback provided" });

            var avgOverall = (int)feedbackList.Average(f => f.OverallScore);
            var avgComm = (int)feedbackList.Average(f => f.CommunicationScore);
            var avgTech = (int)feedbackList.Average(f => f.TechnicalScore);
            var avgConf = (int)feedbackList.Average(f => f.ConfidenceScore);
            var avgRel = (int)feedbackList.Average(f => f.RelevanceScore);

            var allStrong = feedbackList.SelectMany(f => f.StrongPoints).Distinct().Take(5).ToList();
            var allImprovement = feedbackList.SelectMany(f => f.ImprovementAreas).Distinct().Take(5).ToList();

            return Ok(new
            {
                overallScore = avgOverall,
                communicationScore = avgComm,
                technicalScore = avgTech,
                confidenceScore = avgConf,
                relevanceScore = avgRel,
                strongPoints = allStrong,
                improvementAreas = allImprovement,
                totalQuestions = feedbackList.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating feedback summary");
            return StatusCode(500, new { error = "Failed to generate summary" });
        }
    }
}
