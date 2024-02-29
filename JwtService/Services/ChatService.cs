using System.Collections.Concurrent;
using System.Security.Claims;
using ChatServiceGrpc;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;

namespace JwtService.Services;

[Authorize]
public class ChatService : ChatServiceGrpc.ChatService.ChatServiceBase
{
    private static readonly ConcurrentDictionary<string, IServerStreamWriter<ReceiveMessage>> _chatRooms = new();
    public override async Task ProccessConversation(IAsyncStreamReader<SendMessage> requestStream,
        IServerStreamWriter<ReceiveMessage> responseStream,
        ServerCallContext context)
    {
        var username = context.GetHttpContext().User.FindFirstValue(ClaimTypes.NameIdentifier);
        while (!context.CancellationToken.IsCancellationRequested)
        {
            await JoinToChat(username!, responseStream);
            var readTask = Task.Run(async () =>
            {
                await foreach (var message in requestStream.ReadAllAsync())
                {
                    var messageToSend = new ReceiveMessage() {Text = message.Text, Username = username};
                    Console.WriteLine(messageToSend);
                    await SendMessageToAll(messageToSend);
                }
            });
            
            await readTask;
        }

        await LeaveChat(username);
    }

    private async Task SendMessageToAll(ReceiveMessage message)
    {
        if (_chatRooms.ContainsKey(message.Username))
        {
            var tasks = (from key in _chatRooms.Keys 
                where key != message.Username 
                select _chatRooms[key].WriteAsync(message)).ToList();

            await Task.WhenAll(tasks);
        }
    }

    private Task JoinToChat(string username, IServerStreamWriter<ReceiveMessage> responseStream)
    {
        if (!_chatRooms.ContainsKey(username))
        {
            _chatRooms.AddOrUpdate(username,
                _ => responseStream,
                (_, _) => responseStream);
        }

        return Task.CompletedTask;
    }
    
    private Task LeaveChat(string username)
    {
        _chatRooms.TryRemove(username, out _);
        return Task.CompletedTask;
    }
}