using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Services;

public class NameUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        return connection.User?.Identity?.Name ?? string.Empty;
    }
}

public class EmailBasedUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        return connection.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
            ?? string.Empty;
    }
}
