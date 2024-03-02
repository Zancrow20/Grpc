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
            await SendMessageToAll(new PublishedMessage() {Text = request.Text, Username = username});   
        
        return new Empty();
    }

    public override async Task SubscribeMessages(Empty request, IServerStreamWriter<PublishedMessage> responseStream, ServerCallContext context)
    {
        var username = GetUserNameFromContext(context);
        await JoinChat(username!, responseStream);
        await Task.FromCanceled(context.CancellationToken);
        await LeaveChat(username);
    }

    private async Task SendMessageToAll(PublishedMessage message)
    {
        if (_usernameToReceiveStreamMapping.ContainsKey(message.Username))
        {
            var tasks = (from key in _usernameToReceiveStreamMapping.Keys 
                where key != message.Username 
                select _usernameToReceiveStreamMapping[key].WriteAsync(message)).ToList();

            await Task.WhenAll(tasks);
        }
    }

    private Task LeaveChat(string username)
    {
        _usernameToReceiveStreamMapping.TryRemove(username, out _);
        return Task.CompletedTask;
    }
    
    private Task JoinChat(string username, IServerStreamWriter<PublishedMessage> responseStream)
    {
        if (!_usernameToReceiveStreamMapping.ContainsKey(username))
        {
            _usernameToReceiveStreamMapping.AddOrUpdate(username,
                _ => responseStream,
                (_, _) => responseStream);
        }

        return Task.CompletedTask;
    }

    private string GetUserNameFromContext(ServerCallContext context) 
        => context.GetHttpContext().User.FindFirstValue(ClaimTypes.NameIdentifier)!;
}