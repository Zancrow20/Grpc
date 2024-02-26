using Grpc.Core;
using Grpc.Net.Client;
using WeatherForecastProto.Grpc.Protos;

using var channel = GrpcChannel.ForAddress("http://localhost:5092");

var client = new WeatherForecast.WeatherForecastClient(channel);
 
var serverData = client.GetWeatherForecast(new WeatherForecastRequest {Longitude = 55.78f, Latitude = 49.12f});
 
var responseStream = serverData.ResponseStream;

await foreach(var reply in responseStream.ReadAllAsync())
{
    var now = TimeOnly.FromDateTime(DateTime.Now);
    Console.WriteLine($"{now.Hour}.{now.Minute}.{now.Second} погода на {reply.Date.ToDateTime():dd.MM.yy HH:mm}");
}