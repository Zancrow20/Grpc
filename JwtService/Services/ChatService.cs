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
    private static readonly ConcurrentDictionary<string, IServerStreamWriter<PublishedMessage>> _usernameToReceiveStreamMapping = new();


    public override Task<Empty> SendMessage(Message request, ServerCallContext context)
    {
        //todo: client sends message
        /*
            var username = GetUserNameFromContext();
            var ct = context.CancellationToken;
            while (!ct.IsCancellationRequested)
            {
                await foreach (var message in requestStream.ReadAllAsync(ct))
                {
                    await SendMessageToAll(new ReceiveMessage() {Text = message.Text, Username = username});
                }
            
            }
        */
        return base.SendMessage(request, context);
    }

    public override Task SubscribeMessages(Empty request, IServerStreamWriter<PublishedMessage> responseStream, ServerCallContext context)
    {
        //todo: client subscribes topic (main chat)
        /*
           var username = GetUserNameFromContext();
           await JoinChat(username!, responseStream);
           await Task.FromCanceled(stopping token)
           await LeaveChat(username)
         */
        return base.SubscribeMessages(request, responseStream, context);
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

    private string GetUserNameFromContext(ServerCallContext context) => context.GetHttpContext().User.FindFirstValue(ClaimTypes.NameIdentifier)!;
}