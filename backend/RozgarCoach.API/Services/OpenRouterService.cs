using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using RozgarCoach.API.Models;

namespace RozgarCoach.API.Services;

public class OpenRouterService : IOpenRouterService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly string _model;
    private readonly string? _siteUrl;
    private readonly string? _appName;
    private readonly ILogger<OpenRouterService> _logger;

    public OpenRouterService(HttpClient httpClient, IConfiguration config, ILogger<OpenRouterService> logger)
    {
        _httpClient = httpClient;
        _apiKey = config["OPENROUTER_API_KEY"]
            ?? throw new InvalidOperationException("OPENROUTER_API_KEY not configured");
        _baseUrl = config["OpenRouter:BaseUrl"] ?? "https://openrouter.ai/api/v1";
        _model = config["OpenRouter:Model"] ?? "anthropic/claude-3.5-sonnet";
        _siteUrl = config["OpenRouter:SiteUrl"];
        _appName = config["OpenRouter:AppName"];
        _logger = logger;

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        if (!string.IsNullOrWhiteSpace(_siteUrl))
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("HTTP-Referer", _siteUrl);
        if (!string.IsNullOrWhiteSpace(_appName))
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("X-Title", _appName);
        _httpClient.Timeout = TimeSpan.FromSeconds(90);
    }

    public async Task<string> GetNextQuestionAsync(QuestionRequest request)
    {
        var systemPrompt = $@"You are 'Rozgar Coach', a professional interview coach for Pakistani job seekers.

JOB CATEGORY: {request.JobCategory}
DIFFICULTY: {request.Difficulty}
LANGUAGE: English
QUESTION NUMBER: {request.QuestionNumber} of 10

RULES:
- Respond in PURE ENGLISH ONLY. No Urdu or Roman Urdu words whatsoever.
- Ask ONE interview question at a time
- Vary question types across the interview: HR/personal, behavioral, technical, situational
- Keep the question professional and relevant to {request.JobCategory} jobs in Pakistan
- DO NOT provide answers, suggestions, or hints
- DO NOT number the question or add prefixes like 'Question:'
- Just output the question text directly, nothing else";

        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };

        if (request.History != null && request.History.Any())
        {
            foreach (var h in request.History)
            {
                messages.Add(new { role = h.Role, content = h.Content });
            }
        }

        messages.Add(new
        {
            role = "user",
            content = $"Please ask the next interview question (number {request.QuestionNumber} of 10) for the {request.JobCategory} position."
        });

        return await CallChatAsync(messages, 800);
    }

    public async Task<FeedbackResponse> EvaluateAnswerAsync(AnswerRequest request)
    {
        var systemPrompt = $@"You are a strict but fair Pakistani interview evaluator.

JOB CATEGORY: {request.JobCategory}
LANGUAGE: English

ABSOLUTE LANGUAGE ENFORCEMENT: Every text field (strongPoints, improvementAreas, detailedFeedback, idealAnswer) MUST be written in PURE ENGLISH ONLY. No Urdu/Roman Urdu words whatsoever.

Evaluate the candidate's answer and return ONLY a valid JSON object (no markdown, no backticks, no commentary).
The JSON MUST follow this exact schema:
{{
  ""overallScore"": <integer 0-100>,
  ""communicationScore"": <integer 0-100>,
  ""technicalScore"": <integer 0-100>,
  ""confidenceScore"": <integer 0-100>,
  ""relevanceScore"": <integer 0-100>,
  ""strongPoints"": [""short point 1"", ""short point 2""],
  ""improvementAreas"": [""short area 1"", ""short area 2""],
  ""detailedFeedback"": ""2-3 sentence constructive feedback"",
  ""idealAnswer"": ""a concise ideal answer a strong candidate would give"",
  ""questionScore"": <integer 0-100 for THIS specific question>
}}

Scoring guidelines:
- 80-100: Excellent answer, well-structured, strong content
- 60-79: Good answer, mostly correct, some gaps
- 40-59: Average answer, partially correct, needs improvement
- 20-39: Weak answer, missing key points
- 0-19: Very poor or irrelevant answer

Consider: clarity, structure, technical accuracy, confidence, relevance to Pakistan's job market.";

        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt },
            new
            {
                role = "user",
                content = $"JOB: {request.JobCategory}\nQUESTION {request.QuestionNumber}: {request.Question}\nCANDIDATE'S ANSWER: {request.UserAnswer}\n\nEvaluate the answer and return ONLY the JSON object."
            }
        };

        var raw = await CallChatAsync(messages, 1500);

        try
        {
            var cleaned = ExtractJson(raw);
            var feedback = JsonSerializer.Deserialize<FeedbackResponse>(cleaned,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (feedback == null)
                throw new InvalidOperationException("Deserialization returned null");

            if (feedback.StrongPoints == null) feedback.StrongPoints = new List<string>();
            if (feedback.ImprovementAreas == null) feedback.ImprovementAreas = new List<string>();

            return feedback;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse feedback JSON. Raw: {Raw}", raw);
            return new FeedbackResponse
            {
                OverallScore = 50,
                CommunicationScore = 50,
                TechnicalScore = 50,
                ConfidenceScore = 50,
                RelevanceScore = 50,
                QuestionScore = 50,
                StrongPoints = new List<string> { "Answer was submitted" },
                ImprovementAreas = new List<string> { "Try to provide more specific examples" },
                DetailedFeedback = "We could not fully evaluate your answer this time, but it was recorded.",
                IdealAnswer = "A strong answer would directly address the question with specific examples and clear structure."
            };
        }
    }

    private string ExtractJson(string raw)
    {
        var trimmed = raw.Trim();

        if (trimmed.StartsWith("```"))
        {
            trimmed = Regex.Replace(trimmed, @"^```(?:json)?\s*", "");
            trimmed = Regex.Replace(trimmed, @"\s*```$", "");
        }

        var firstBrace = trimmed.IndexOf('{');
        var lastBrace = trimmed.LastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace)
        {
            trimmed = trimmed.Substring(firstBrace, lastBrace - firstBrace + 1);
        }

        return trimmed.Trim();
    }

    public async Task<MCQSet> GenerateQuestionsBankAsync(QuestionsBankRequest request)
    {
        var prompt = $"Role: Rozgar Coach interview question generator.\nJob: {request.JobCategory}\nLevel: {request.Difficulty}\nLanguage: English\n\nGenerate 10 MCQs in PURE ENGLISH ONLY. No Urdu/Roman Urdu words. Each: question text, 4 options, correctOptionIndex (0-3), brief explanation. Vary types. Return ONLY JSON array. No markdown.\n\nFormat: {{\"questions\":[{{\"questionNumber\":1,\"question\":\"text\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctOptionIndex\":0,\"explanation\":\"text\"}}]}}";

        var messages = new List<object>
        {
            new { role = "system", content = prompt },
            new { role = "user", content = $"Generate 10 MCQs for {request.JobCategory}. Language: English. Return JSON only." }
        };

        try
        {
            var raw = await CallChatAsync(messages, 800);
            var cleaned = ExtractJson(raw);
            var mcqSet = JsonSerializer.Deserialize<MCQSet>(cleaned,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (mcqSet?.Questions != null && mcqSet.Questions.Count > 0)
            {
                mcqSet.JobCategory = request.JobCategory;
                mcqSet.Language = "english";
                for (int i = 0; i < mcqSet.Questions.Count; i++)
                    mcqSet.Questions[i].QuestionNumber = i + 1;
                return mcqSet;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "API call failed, using fallback MCQs");
        }

        return GetFallbackMCQs(request.JobCategory);
    }

    private async Task<string> CallChatAsync(IEnumerable<object> messages, int maxTokens)
    {
        var url = $"{_baseUrl.TrimEnd('/')}/chat/completions";
        var body = new
        {
            model = _model,
            max_tokens = maxTokens,
            messages = messages
        };

        var response = await _httpClient.PostAsJsonAsync(url, body);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("OpenRouter API error: {Status} - {Error}", response.StatusCode, error);
            throw new HttpRequestException($"OpenRouter API returned {response.StatusCode}: {error}");
        }

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString()
            ?? throw new InvalidOperationException("Empty response from OpenRouter");
    }

    private static MCQSet GetFallbackMCQs(string category)
    {
        List<MCQ> mcqs;

        if (category.Contains("software", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("it", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("developer", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetITFallbackEnglish();
        }
        else if (category.Contains("government", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("public", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("civil", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetGovFallbackEnglish();
        }
        else if (category.Contains("bank", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("finance", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetBankingFallbackEnglish();
        }
        else if (category.Contains("teach", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("education", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetTeachingFallbackEnglish();
        }
        else if (category.Contains("sales", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("market", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetSalesFallbackEnglish();
        }
        else if (category.Contains("health", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("medical", StringComparison.OrdinalIgnoreCase) ||
                 category.Contains("care", StringComparison.OrdinalIgnoreCase))
        {
            mcqs = GetHealthcareFallbackEnglish();
        }
        else
        {
            mcqs = GetGeneralFallbackEnglish();
        }

        for (int i = 0; i < mcqs.Count; i++)
            mcqs[i].QuestionNumber = i + 1;

        return new MCQSet { JobCategory = category, Language = "english", Questions = mcqs };
    }

    private static List<MCQ> GetITFallbackEnglish() => new()
    {
        new() { Question = "What is the time complexity of binary search?", Options = new() { "O(n)", "O(log n)", "O(n^2)", "O(1)" }, CorrectOptionIndex = 1, Explanation = "Binary search divides the array in half each time, giving O(log n) complexity." },
        new() { Question = "What does API stand for?", Options = new() { "Application Programming Interface", "Applied Program Integration", "Automatic Protocol Interface", "Application Process Integration" }, CorrectOptionIndex = 0, Explanation = "API stands for Application Programming Interface." },
        new() { Question = "Which of these is a version control system?", Options = new() { "Docker", "Git", "Jenkins", "NPM" }, CorrectOptionIndex = 1, Explanation = "Git is a distributed version control system." },
        new() { Question = "What is the primary key in a database?", Options = new() { "A unique identifier for each row", "A key used for encryption", "A foreign reference", "An index for searching" }, CorrectOptionIndex = 0, Explanation = "A primary key uniquely identifies each record in a database table." },
        new() { Question = "Which language is primarily used for web styling?", Options = new() { "HTML", "CSS", "JavaScript", "Python" }, CorrectOptionIndex = 1, Explanation = "CSS (Cascading Style Sheets) is used for styling web pages." },
        new() { Question = "What is a variable in programming?", Options = new() { "A fixed value", "A container for storing data", "A type of loop", "A function" }, CorrectOptionIndex = 1, Explanation = "A variable is a named container that stores data in memory." },
        new() { Question = "Which protocol secures web traffic?", Options = new() { "HTTP", "FTP", "HTTPS", "SMTP" }, CorrectOptionIndex = 2, Explanation = "HTTPS (HTTP Secure) encrypts communication between browser and server." },
        new() { Question = "What does 'debugging' mean?", Options = new() { "Writing new code", "Fixing errors in code", "Deleting code", "Compiling code" }, CorrectOptionIndex = 1, Explanation = "Debugging is the process of finding and fixing errors in software." },
        new() { Question = "Which company developed Java?", Options = new() { "Microsoft", "Apple", "Sun Microsystems", "Google" }, CorrectOptionIndex = 2, Explanation = "Java was developed by Sun Microsystems (now owned by Oracle)." },
        new() { Question = "What is the full form of SQL?", Options = new() { "Simple Query Language", "Structured Query Language", "Standard Query Language", "System Query Language" }, CorrectOptionIndex = 1, Explanation = "SQL stands for Structured Query Language." },
    };

    private static List<MCQ> GetGovFallbackEnglish() => new()
    {
        new() { Question = "Who is the head of state of Pakistan?", Options = new() { "Prime Minister", "President", "Chief Justice", "Speaker" }, CorrectOptionIndex = 1, Explanation = "The President is the head of state of Pakistan." },
        new() { Question = "How many provinces does Pakistan have?", Options = new() { "2", "3", "4", "5" }, CorrectOptionIndex = 2, Explanation = "Pakistan has 4 provinces: Punjab, Sindh, KPK, and Balochistan." },
        new() { Question = "What is the national language of Pakistan?", Options = new() { "Punjabi", "Sindhi", "Urdu", "Pashto" }, CorrectOptionIndex = 2, Explanation = "Urdu is the national language of Pakistan." },
        new() { Question = "Who appoints the Chief Justice of Pakistan?", Options = new() { "Prime Minister", "President", "Parliament", "Chief Justice himself" }, CorrectOptionIndex = 1, Explanation = "The President appoints the Chief Justice of Pakistan." },
        new() { Question = "What is the minimum age for voting in Pakistan?", Options = new() { "16", "18", "21", "25" }, CorrectOptionIndex = 1, Explanation = "The minimum voting age in Pakistan is 18 years." },
        new() { Question = "Pakistan's constitution was enacted in which year?", Options = new() { "1947", "1956", "1973", "1985" }, CorrectOptionIndex = 2, Explanation = "The current constitution of Pakistan was enacted in 1973." },
        new() { Question = "What does FPSC stand for?", Options = new() { "Federal Public Service Commission", "Federal Personnel Selection Committee", "Federal Public Safety Council", "Federal Planning Service Commission" }, CorrectOptionIndex = 0, Explanation = "FPSC stands for Federal Public Service Commission." },
        new() { Question = "How many members are in the Senate of Pakistan?", Options = new() { "96", "100", "104", "112" }, CorrectOptionIndex = 2, Explanation = "The Senate of Pakistan has 104 members." },
        new() { Question = "What is the term of the National Assembly in Pakistan?", Options = new() { "3 years", "5 years", "6 years", "4 years" }, CorrectOptionIndex = 1, Explanation = "The National Assembly's term is 5 years." },
        new() { Question = "Which article of the Constitution deals with fundamental rights?", Options = new() { "Articles 8-28", "Articles 1-7", "Articles 29-40", "Articles 41-50" }, CorrectOptionIndex = 0, Explanation = "Fundamental rights are covered in Articles 8 to 28 of the Constitution." },
    };

    private static List<MCQ> GetBankingFallbackEnglish() => new()
    {
        new() { Question = "What is the current policy rate in Pakistan?", Options = new() { "15%", "20%", "22%", "12%" }, CorrectOptionIndex = 2, Explanation = "The current policy rate affects interest rates across the banking sector." },
        new() { Question = "What does ATM stand for?", Options = new() { "Automated Teller Machine", "Automatic Transaction Machine", "Auto Transfer Machine", "Automated Teller Module" }, CorrectOptionIndex = 0, Explanation = "ATM stands for Automated Teller Machine." },
        new() { Question = "Which bank is the central bank of Pakistan?", Options = new() { "HBL", "NBP", "State Bank of Pakistan", "UBL" }, CorrectOptionIndex = 2, Explanation = "State Bank of Pakistan is the central bank." },
        new() { Question = "What is NIFT in banking?", Options = new() { "A bank", "A clearing house", "A loan type", "An account type" }, CorrectOptionIndex = 1, Explanation = "NIFT is the national clearing house for interbank transactions." },
        new() { Question = "What does KYC stand for?", Options = new() { "Know Your Customer", "Keep Your Cash", "Know Your Credit", "Keep Your Card" }, CorrectOptionIndex = 0, Explanation = "KYC (Know Your Customer) is the process of verifying customer identity." },
        new() { Question = "Which is the largest bank in Pakistan?", Options = new() { "HBL", "NBP", "MCB", "UBL" }, CorrectOptionIndex = 0, Explanation = "HBL (Habib Bank Limited) is the largest bank in Pakistan." },
        new() { Question = "What is a current account?", Options = new() { "Savings account", "Account for daily transactions", "Fixed deposit account", "Loan account" }, CorrectOptionIndex = 1, Explanation = "A current account is used for frequent daily transactions." },
        new() { Question = "What does SBP regulate?", Options = new() { "Stock market", "Banking sector", "Insurance", "Real estate" }, CorrectOptionIndex = 1, Explanation = "SBP regulates the banking sector of Pakistan." },
        new() { Question = "What is a bounced cheque?", Options = new() { "A cancelled cheque", "A cheque without funds", "A post-dated cheque", "A certified cheque" }, CorrectOptionIndex = 1, Explanation = "A bounced cheque has insufficient funds in the account." },
        new() { Question = "What is the purpose of credit scoring?", Options = new() { "To calculate profit", "To assess borrower risk", "To determine exchange rate", "To set interest rate" }, CorrectOptionIndex = 1, Explanation = "Credit scoring assesses the risk of lending to a borrower." },
    };

    private static List<MCQ> GetTeachingFallbackEnglish() => new()
    {
        new() { Question = "What is the main role of a teacher?", Options = new() { "To give lectures", "To facilitate learning", "To assign homework", "To maintain discipline" }, CorrectOptionIndex = 1, Explanation = "The main role is to facilitate and guide student learning." },
        new() { Question = "What does pedagogy mean?", Options = new() { "Subject knowledge", "Teaching methods", "Student behavior", "School administration" }, CorrectOptionIndex = 1, Explanation = "Pedagogy refers to the methods and practices of teaching." },
        new() { Question = "Which learning theory emphasizes rewards?", Options = new() { "Constructivism", "Behaviorism", "Cognitivism", "Humanism" }, CorrectOptionIndex = 1, Explanation = "Behaviorism focuses on reinforcement and rewards." },
        new() { Question = "What is a lesson plan?", Options = new() { "A school timetable", "A teacher's guide for a lesson", "A student's homework", "An exam paper" }, CorrectOptionIndex = 1, Explanation = "A lesson plan outlines the structure and content of a teaching session." },
        new() { Question = "What does Bloom's taxonomy classify?", Options = new() { "Student grades", "Learning objectives", "Teaching styles", "School types" }, CorrectOptionIndex = 1, Explanation = "Bloom's taxonomy classifies levels of learning objectives." },
        new() { Question = "What is inclusive education?", Options = new() { "Education for gifted students", "Education for all students regardless of ability", "Private education", "Online education" }, CorrectOptionIndex = 1, Explanation = "Inclusive education means all students learn together regardless of differences." },
        new() { Question = "What is assessment for learning?", Options = new() { "Final exams", "Formative assessment during learning", "Homework grading", "Project evaluation" }, CorrectOptionIndex = 1, Explanation = "Formative assessment is done during the learning process to guide instruction." },
        new() { Question = "Which is a student-centered teaching method?", Options = new() { "Lecture method", "Group discussion", "Dictation", "Demonstration only" }, CorrectOptionIndex = 1, Explanation = "Group discussion actively involves students in learning." },
        new() { Question = "What is the purpose of feedback in education?", Options = new() { "To assign grades", "To improve student learning", "To rank students", "To fill time" }, CorrectOptionIndex = 1, Explanation = "Feedback helps students understand their progress and improve." },
        new() { Question = "What does curriculum mean?", Options = new() { "List of teachers", "Set of courses and content", "School building", "Exam schedule" }, CorrectOptionIndex = 1, Explanation = "Curriculum is the set of courses and their content offered by an institution." },
    };

    private static List<MCQ> GetSalesFallbackEnglish() => new()
    {
        new() { Question = "What is the first step in the sales process?", Options = new() { "Closing", "Prospecting", "Presentation", "Follow-up" }, CorrectOptionIndex = 1, Explanation = "Prospecting is identifying potential customers." },
        new() { Question = "What does CRM stand for?", Options = new() { "Customer Relationship Management", "Customer Retention Model", "Customer Response Mechanism", "Client Relationship Method" }, CorrectOptionIndex = 0, Explanation = "CRM stands for Customer Relationship Management." },
        new() { Question = "What is a cold call?", Options = new() { "Calling an existing customer", "Calling a prospect without prior contact", "Calling in cold weather", "A follow-up call" }, CorrectOptionIndex = 1, Explanation = "A cold call is contacting someone who hasn't expressed interest before." },
        new() { Question = "What does upselling mean?", Options = new() { "Reducing the price", "Selling a higher-value product", "Selling multiple units", "Discounting products" }, CorrectOptionIndex = 1, Explanation = "Upselling is encouraging customers to buy a more expensive product." },
        new() { Question = "Which is a key sales skill?", Options = new() { "Active listening", "Avoiding questions", "Talking continuously", "Ignoring objections" }, CorrectOptionIndex = 0, Explanation = "Active listening helps understand customer needs better." },
        new() { Question = "What is a sales funnel?", Options = new() { "A physical tool", "The customer journey from awareness to purchase", "A discount scheme", "An inventory method" }, CorrectOptionIndex = 1, Explanation = "A sales funnel represents the stages a customer goes through before buying." },
        new() { Question = "What does objection handling mean?", Options = new() { "Ignoring complaints", "Addressing customer concerns", "Creating problems", "Ending the call" }, CorrectOptionIndex = 1, Explanation = "Objection handling means professionally addressing customer concerns." },
        new() { Question = "What is a lead in sales?", Options = new() { "A competitor", "A potential customer", "A product", "A sales target" }, CorrectOptionIndex = 1, Explanation = "A lead is a person or organization that may become a customer." },
        new() { Question = "What is the best way to close a sale?", Options = new() { "Asking for the order", "Waiting for the customer", "Reducing price", "Leaving a brochure" }, CorrectOptionIndex = 0, Explanation = "Directly asking for the order is an effective closing technique." },
        new() { Question = "What is a target market?", Options = new() { "All customers", "A specific group of potential customers", "Competitors", "Previous customers" }, CorrectOptionIndex = 1, Explanation = "A target market is a specific group of consumers aimed at for sales." },
    };

    private static List<MCQ> GetHealthcareFallbackEnglish() => new()
    {
        new() { Question = "What is the first step in patient care?", Options = new() { "Diagnosis", "Patient assessment", "Treatment", "Discharge" }, CorrectOptionIndex = 1, Explanation = "Patient assessment is the first step to understand patient condition." },
        new() { Question = "What does PPE stand for?", Options = new() { "Patient Protection Equipment", "Personal Protective Equipment", "Public Protection Equipment", "Personal Patient Equipment" }, CorrectOptionIndex = 1, Explanation = "PPE stands for Personal Protective Equipment." },
        new() { Question = "Which vital sign is measured with a sphygmomanometer?", Options = new() { "Temperature", "Blood pressure", "Pulse", "Respiration" }, CorrectOptionIndex = 1, Explanation = "A sphygmomanometer measures blood pressure." },
        new() { Question = "What is the normal body temperature in Celsius?", Options = new() { "36°C", "37°C", "38°C", "39°C" }, CorrectOptionIndex = 1, Explanation = "Normal body temperature is approximately 37°C (98.6°F)." },
        new() { Question = "What is informed consent?", Options = new() { "Patient's agreement after understanding risks", "Doctor's permission", "Hospital policy", "Legal document only" }, CorrectOptionIndex = 0, Explanation = "Informed consent means the patient agrees after understanding all risks." },
        new() { Question = "What does ICU stand for?", Options = new() { "Intensive Care Unit", "Internal Care Unit", "Intensive check-up Unit", "Injury Care Unit" }, CorrectOptionIndex = 0, Explanation = "ICU stands for Intensive Care Unit." },
        new() { Question = "What is the first step in infection control?", Options = new() { "Antibiotics", "Hand hygiene", "Vaccination", "Isolation" }, CorrectOptionIndex = 1, Explanation = "Hand hygiene is the most important step in preventing infection spread." },
        new() { Question = "What does CPR stand for?", Options = new() { "Cardiac Pulmonary Resuscitation", "Cardiopulmonary Resuscitation", "Cardiac Patient Recovery", "Critical Patient Resuscitation" }, CorrectOptionIndex = 1, Explanation = "CPR stands for Cardiopulmonary Resuscitation." },
        new() { Question = "What is the normal heart rate for adults?", Options = new() { "40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm" }, CorrectOptionIndex = 1, Explanation = "Normal adult heart rate is 60-100 beats per minute." },
        new() { Question = "What is patient confidentiality?", Options = new() { "Sharing patient data", "Keeping patient information private", "Discussing cases publicly", "Writing in charts" }, CorrectOptionIndex = 1, Explanation = "Patient confidentiality means keeping patient information secure and private." },
    };

    private static List<MCQ> GetGeneralFallbackEnglish() => new()
    {
        new() { Question = "What is the capital of Pakistan?", Options = new() { "Karachi", "Lahore", "Islamabad", "Peshawar" }, CorrectOptionIndex = 2, Explanation = "Islamabad is the capital city of Pakistan." },
        new() { Question = "What is the currency of Pakistan?", Options = new() { "Rupee", "Dollar", "Taka", "Riyal" }, CorrectOptionIndex = 0, Explanation = "The Pakistani Rupee is the official currency." },
        new() { Question = "Which is the largest city of Pakistan?", Options = new() { "Islamabad", "Lahore", "Karachi", "Quetta" }, CorrectOptionIndex = 2, Explanation = "Karachi is the largest city of Pakistan by population." },
        new() { Question = "How many continents are there?", Options = new() { "5", "6", "7", "8" }, CorrectOptionIndex = 2, Explanation = "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, Australia." },
        new() { Question = "What gas do plants absorb from the air?", Options = new() { "Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen" }, CorrectOptionIndex = 2, Explanation = "Plants absorb carbon dioxide during photosynthesis." },
        new() { Question = "What is the boiling point of water?", Options = new() { "90°C", "100°C", "110°C", "120°C" }, CorrectOptionIndex = 1, Explanation = "Water boils at 100°C at sea level." },
        new() { Question = "Who wrote the national anthem of Pakistan?", Options = new() { "Allama Iqbal", "Hafeez Jalandhari", "Faiz Ahmed Faiz", "Ahmed Faraz" }, CorrectOptionIndex = 1, Explanation = "Hafeez Jalandhari wrote the national anthem of Pakistan." },
        new() { Question = "Which planet is known as the Red Planet?", Options = new() { "Venus", "Mars", "Jupiter", "Saturn" }, CorrectOptionIndex = 1, Explanation = "Mars is called the Red Planet due to its reddish appearance." },
        new() { Question = "What is the largest ocean in the world?", Options = new() { "Atlantic", "Indian", "Pacific", "Arctic" }, CorrectOptionIndex = 2, Explanation = "The Pacific Ocean is the largest and deepest ocean." },
        new() { Question = "How many bones are in the human body?", Options = new() { "106", "206", "306", "406" }, CorrectOptionIndex = 1, Explanation = "An adult human has 206 bones." },
    };
}
