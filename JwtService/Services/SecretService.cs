using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using TestService.Protos;

namespace JwtService.Services;

[Authorize]
public class SecretService : PrivateService.PrivateServiceBase
{
    public override Task<SecretReply> GetSecret(Empty request, ServerCallContext context)
    {
        return Task.FromResult(new SecretReply(){Message = "Hello world!"});
    }
}