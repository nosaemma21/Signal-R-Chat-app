using ChatApp.Server.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Hubs;

[Authorize]
public class ChatHub : Hub<IChatClient>
{
    public Task SendMessage(string username, string message)
    {
        return Clients.All.ReceiveMessage(username, message);
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.All.UserConnected(Context.User.Identity.Name);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        await Clients.All.UserDisconnected(Context.User.Identity.Name);
        await base.OnDisconnectedAsync(ex);
    }

    public Task SendMessageToUser(string user, string toUser, string message)
    {
        return Clients.User(toUser).ReceiveMessage(user, message);
    }

    public async Task AddToGroup(string user, string group)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, group);
        await Clients
            .Group(group)
            .ReceiveMessage(
                Context.User.Identity.Name,
                $"{user} has joined the group {group}. Connection Id: {Context.ConnectionId}"
            );
    }

    public async Task RemoveFromGroup(string user, string group)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        await Clients
            .Group(group)
            .ReceiveMessage(
                Context.User.Identity.Name,
                $"{user} has left the group {group}. Connection Id: {Context.ConnectionId}"
            );
    }

    //Send message to a group
    public async Task SendMessageToGroup(string user, string group, string message)
    {
        await Clients.Group(group).ReceiveMessage(user, message);
    }
}
