using System;

namespace ChatApp.Server.Intefaces;

public interface IChatClient
{
    Task ReceiveMessage(string user, string message);
    Task UserConnected(string user);
    Task UserDisconnected(string user);
}
