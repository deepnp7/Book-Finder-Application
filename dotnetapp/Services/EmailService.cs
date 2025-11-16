using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace dotnetapp.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;   // used to read SMTP settings
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtp = _config.GetSection("SMTP");

            using var client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"]))
            {
                Credentials = new NetworkCredential(smtp["Username"], smtp["Password"]),
                EnableSsl = true
            };

            var mail = new MailMessage(smtp["From"], to, subject, body);

            await client.SendMailAsync(mail);
        }
    }
}
