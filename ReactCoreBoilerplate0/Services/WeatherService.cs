using System;
using System.Collections.Generic;
using System.Linq;
using ReactCoreBoilerplate0.Infrastructure;
using ReactCoreBoilerplate0.Models;

namespace ReactCoreBoilerplate0.Services
{
    public class WeatherService : ServiceBase
    {
        static List<WeatherForecast> Forecasts { get; set; }

        private static string[] Summaries = new[]
{
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        static WeatherService()
        {
        }

        public virtual Result<List<WeatherForecast>> WeatherForecasts(int startDateIndex = 0)
        {
            Forecasts = new List<WeatherForecast>();
            var rng = new Random();

            Forecasts.AddRange(Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            }));

            return Ok(Forecasts);
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
