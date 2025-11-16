using System.Net;
using System.Text.Json;

namespace dotnetapp.Middleware
{
    // Middleware that catches ALL unhandled exceptions in the request pipeline
    public class GlobalExceptionMiddleware
    {
        // Points to the next middleware in pipeline
        private readonly RequestDelegate _next;
        // For logging errors
        private readonly ILogger<GlobalExceptionMiddleware> _logger; 

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        // Main middleware method that intercepts requests
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Continue normal request execution
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log the exception (stored into console/file depending on setup)
                _logger.LogError(ex, ex.Message);

                // Return custom error response to the client
                await HandleExceptionAsync(context, ex);
            }
        }

        // Builds a clean JSON error response
        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Response will always be JSON
            context.Response.ContentType = "application/json";

            // Set HTTP status code (500 - Internal Server Error)
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Custom response format
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = ex.Message // You can hide ex.Message in production
            };

            // Convert object -> formatted JSON string
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            // Write JSON to response body
            return context.Response.WriteAsync(json);
        }
    }
}
