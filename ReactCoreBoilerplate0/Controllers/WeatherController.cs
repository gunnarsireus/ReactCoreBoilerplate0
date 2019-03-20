using Microsoft.AspNetCore.Mvc;
using ReactCoreBoilerplate0.Models;
using ReactCoreBoilerplate0.Services;

namespace ReactCoreBoilerplate0.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private WeatherService WeatherService { get; }

        public WeatherController(WeatherService weatherService)
        {
            WeatherService = weatherService;
        }

        [HttpGet("[action]")]
        public IActionResult Forecasts([FromQuery]int startDateIndex = 0)
        {
            return Json(WeatherService.WeatherForecasts(startDateIndex));
        }

    }
}
