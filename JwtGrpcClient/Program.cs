// See https://aka.ms/new-console-template for more information

using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Grpc.Net.Client;
using JwtService.Protos;
using TestService.Protos;


var channel = GrpcChannel.ForAddress("http://localhost:5124");

var client = new OpenService.OpenServiceClient(channel);

var token = await client.GetTokenAsync(new User(){Password = "123", Username = "123"});

var headers = new Metadata
{
    { "Authorization", $"Bearer {token.Token}" }
};

var privateClient = new PrivateService.PrivateServiceClient(channel);

var reply = await privateClient.GetSecretAsync(
    new Empty(), headers);

Console.WriteLine(reply);