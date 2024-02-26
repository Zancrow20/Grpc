using System.Text.Json;
using System.Text.Json.Serialization;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using WeatherForecastProto.Grpc.Protos;

namespace Grpc.Services;

public class WeatherForecastService : WeatherForecast.WeatherForecastBase
{
    private readonly ILogger<WeatherForecastService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public WeatherForecastService(ILogger<WeatherForecastService> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public override async Task GetWeatherForecast(WeatherForecastRequest request, IServerStreamWriter<WeatherForecastReply> responseStream, ServerCallContext context)
    {
        var url = $"https://api.open-meteo.com/v1/forecast?latitude={request.Latitude}&longitude={request.Longitude}&hourly=temperature_2m&past_days=92&timezone=Europe%2FMoscow";
        var httpClient = _httpClientFactory.CreateClient();
        var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);
        var httpResponseMessage = await httpClient.SendAsync(httpRequestMessage, context.CancellationToken);
        await using var contentStream =
            await httpResponseMessage.Content.ReadAsStreamAsync();

        var data = await JsonSerializer.DeserializeAsync
            <OpenMeteo[]>(contentStream);

        var openMeteo = data[0];
        
        for (var i = 0; i < openMeteo.Hours.Date.Count; i++)
        {
            if(openMeteo.Hours.Date[i].Hour % 2 != 0)
                continue;
            var reply = new WeatherForecastReply()
            {
                Date = Timestamp.FromDateTime(DateTime.SpecifyKind(openMeteo.Hours.Date[i], DateTimeKind.Utc)),
                Temperature = openMeteo.Hours.Temperature[i]
            };
            await responseStream.WriteAsync(reply);
            await Task.Delay(TimeSpan.FromSeconds(1));
        }
    }

    private record OpenMeteo([property: JsonPropertyName("hourly")] Hours Hours);
    private record Hours(
        [property: JsonPropertyName("time")] IList<DateTime> Date,
        [property: JsonPropertyName("temperature_2m")] IList<double> Temperature);
}