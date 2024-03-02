using System.Collections.Concurrent;
using System.Security.Claims;
using ChatServiceGrpc;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;

namespace JwtService.Services;

[Authorize]
public class ChatService : ChatServiceGrpc.ChatService.ChatServiceBase
{
    private static readonly ConcurrentDictionary<string, IServerStreamWriter<PublishedMessage>> _usernameToReceiveStreamMapping
        = new();


    public override async Task<Empty> SendMessage(Message request, ServerCallContext context)
    {
        var username = GetUserNameFromContext(context);
        var ct = context.CancellationToken;
        if (!ct.IsCancellationRequested)
            await SendMessageToAllAsync(new PublishedMessage() {Text = request.Text, Username = username});   
        
        return new Empty();
    }

    public override async Task SubscribeMessages(Empty request, IServerStreamWriter<PublishedMessage> responseStream, ServerCallContext context)
    {
        var username = GetUserNameFromContext(context);
        if (!_usernameToReceiveStreamMapping.TryAdd(username, responseStream))
            return;

        var ct = context.CancellationToken;
        while (!ct.IsCancellationRequested)
            await Task.Delay(500);

        _usernameToReceiveStreamMapping.TryRemove(username, out _);
    }

    private Task SendMessageToAllAsync(PublishedMessage message)
    {
        if (_usernameToReceiveStreamMapping.ContainsKey(message.Username))
        {
            return Task.WhenAll(_usernameToReceiveStreamMapping
                .Select(x => (Username: x.Key, StreamWriter: x.Value))
                .ToArray()
                .Where(x => x.Username != message.Username)
                .Select(x => x.StreamWriter.WriteAsync(message)));
        }

        return Task.CompletedTask;
    }

    private string GetUserNameFromContext(ServerCallContext context) 
        => context.GetHttpContext().User.FindFirstValue(ClaimTypes.NameIdentifier)!;
}