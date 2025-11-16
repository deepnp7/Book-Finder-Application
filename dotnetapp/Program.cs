using Microsoft.AspNetCore.Identity;
using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using dotnetapp.Models;
using System.Text;
using dotnetapp.Middleware;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

//  Identity Configuration 
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()   // Register Identity with custom user
    .AddEntityFrameworkStores<ApplicationDbContext>()             // Use EF Core for Identity storage
    .AddDefaultTokenProviders();                                  // Enable password reset tokens, etc.

//  Db Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // SQL Server connection

//  Dependency Injection 
builder.Services.AddScoped<EmailService>(); //Email service


builder.Services.AddScoped<BookService>();     // Book service

builder.Services.AddScoped<IAuthService, AuthService>(); // Auth service interface + implementation

//  JWT Configuration 
var jwtSection = configuration.GetSection("JWT");
var key = Encoding.UTF8.GetBytes(jwtSection.GetValue<string>("Secret")); // JWT signing key

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // Set JWT as default auth
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;      // Allow HTTP (useful for development)

    options.SaveToken = true;                  // Save token in the HttpContext

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,                 // Validate token issuer
        ValidateAudience = true,               // Validate audience
        ValidateLifetime = true,               // Validate token expiration
        ValidateIssuerSigningKey = true,       // Validate signature
        ValidIssuer = jwtSection["ValidIssuer"],
        ValidAudience = jwtSection["ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(key) // Signing key
    };
});

builder.Services.AddAuthorization();           // Enable Authorization

builder.Services.AddControllers();             // Add Controller support

//  CORS Configuration 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
    policy => policy.AllowAnyOrigin()          // Allow all origins
            .AllowAnyHeader()                  // Allow any headers
            .AllowAnyMethod());                // Allow any HTTP methods
});

builder.Services.AddEndpointsApiExplorer();    // For minimal API + Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Swagger JWT Support
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

//  Swagger Middleware 
app.UseSwagger();               // Enable Swagger

app.UseSwaggerUI();             // Swagger UI

//  HTTP Pipeline 
app.UseCors("AllowAll");        // Apply CORS policy

app.UseHttpsRedirection();      // Force HTTPS redirection

app.UseRouting();               // Enable routing

app.UseMiddleware<GlobalExceptionMiddleware>(); //enable globalexception

app.UseAuthentication();        // Enable JWT Authentication

app.UseAuthorization();         // Enable role/claim validation

app.MapControllers();           // Map controller endpoints

app.Run();                      // Run the application
