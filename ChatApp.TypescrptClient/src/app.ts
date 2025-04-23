import * as signalR from "@microsoft/signalr";

const txtUsername: HTMLInputElement = document.getElementById(
  "txtUsername"
) as HTMLInputElement;

const txtMessage: HTMLInputElement = document.getElementById(
  "txtMessage"
) as HTMLInputElement;

const btnSend: HTMLButtonElement = document.getElementById(
  "btnSend"
) as HTMLButtonElement;

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7097/chatHub")
  .build();

connection.on("ReceiveMessage", (username: string, message: string) => {
  const li = document.createElement("li");
  li.textContent = `${username}: ${message}`;
  const messageList = document.getElementById("messages");
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
});

connection
  .start()
  .then(() => (btnSend.disabled = false))
  .catch((err) => console.error(err.toString()))
  .then(() => (txtMessage.value = ""));

txtMessage.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    sendMessage();
  }
});

btnSend.addEventListener("click", sendMessage);

function sendMessage() {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    console.warn("SignalR is not connected yet!");
    return;
  }

  connection
    .invoke("SendMessage", txtUsername.value, txtMessage.value)
    .catch((err) => console.error(err.toString()))
    .then(() => (txtMessage.value = ""));
}
