using Microsoft.AspNetCore.Mvc;
using RozgarCoach.API.Models;
using RozgarCoach.API.Services;

namespace RozgarCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InterviewController : ControllerBase
{
    private readonly IOpenRouterService _openRouterService;
    private readonly ILogger<InterviewController> _logger;

    public InterviewController(IOpenRouterService openRouterService, ILogger<InterviewController> logger)
    {
        _openRouterService = openRouterService;
        _logger = logger;
    }

    [HttpPost("question")]
    public async Task<IActionResult> GetQuestion([FromBody] QuestionRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.JobCategory))
                return BadRequest(new { error = "JobCategory is required" });

            var question = await _openRouterService.GetNextQuestionAsync(request);
            return Ok(new { question });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting question");
            return StatusCode(500, new { error = "Failed to generate question", details = ex.Message });
        }
    }

    [HttpPost("evaluate")]
    public async Task<IActionResult> EvaluateAnswer([FromBody] AnswerRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Question) || string.IsNullOrWhiteSpace(request.UserAnswer))
                return BadRequest(new { error = "Question and UserAnswer are required" });

            var feedback = await _openRouterService.EvaluateAnswerAsync(request);
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating answer");
            return StatusCode(500, new { error = "Failed to evaluate answer", details = ex.Message });
        }
    }

    [HttpPost("questions-bank")]
    public async Task<IActionResult> GetQuestionsBank([FromBody] QuestionsBankRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.JobCategory))
                return BadRequest(new { error = "JobCategory is required" });

            var mcqSet = await _openRouterService.GenerateQuestionsBankAsync(request);
            return Ok(mcqSet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating questions bank");
            return StatusCode(500, new { error = "Failed to generate questions bank", details = ex.Message });
        }
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "Rozgar Coach API" });
}
