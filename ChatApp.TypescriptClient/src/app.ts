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

const btnLogin: HTMLButtonElement = document.getElementById(
  "btnLogin"
) as HTMLButtonElement;

const divChat: HTMLDivElement = document.getElementById(
  "divChat"
) as HTMLDivElement;

const txtPassword: HTMLInputElement = document.getElementById(
  "txtPassword"
) as HTMLInputElement;

const lblUsername: HTMLLabelElement = document.getElementById(
  "lblUsername"
) as HTMLLabelElement;

const divLogin: HTMLDivElement = document.getElementById(
  "divLogin"
) as HTMLDivElement;
const txtToUser: HTMLInputElement = document.getElementById(
  "txtToUser"
) as HTMLInputElement;

const txtToGroup: HTMLInputElement = document.getElementById(
  "txtToGroup"
) as HTMLInputElement;

const btnJoinGroup: HTMLButtonElement = document.getElementById(
  "btnJoinGroup"
) as HTMLButtonElement;

const btnLeaveGroup: HTMLButtonElement = document.getElementById(
  "btnLeaveGroup"
) as HTMLButtonElement;

divChat.style.display = "none";
btnSend.disabled = true;

btnLogin.addEventListener("click", login);
let connection: signalR.HubConnection = null;

function joinGroup() {
  if (txtToGroup.value) {
    connection
      .invoke("AddToGroup", lblUsername.textContent, txtToGroup.value)
      .catch((err) => console.error(err.toString()))
      .then(() => {
        btnJoinGroup.disabled = true;
        btnJoinGroup.style.display = "none";
        btnLeaveGroup.disabled = false;
        btnLeaveGroup.style.display = "inline";
        txtToGroup.readOnly = true;
      });
  }
}

function leaveGroup() {
  if (txtToGroup.value) {
    connection
      .invoke("RemoveFromGroup", lblUsername.textContent, txtToGroup.value)
      .catch((err) => console.error(err.toString()))
      .then(() => {
        btnJoinGroup.disabled = false;
        btnJoinGroup.style.display = "inline";
        btnLeaveGroup.disabled = true;
        btnLeaveGroup.style.display = "none";
        txtToGroup.readOnly = false;
      });
  }
}

btnJoinGroup.addEventListener("click", joinGroup);
btnLeaveGroup.addEventListener("click", leaveGroup);

async function login() {
  const username = txtUsername.value;
  const password = txtPassword.value;
  if (username && password) {
    try {
      // Use the Fetch API to login
      const response = await fetch("https://localhost:7097/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();
      localStorage.setItem("token", json.token);
      localStorage.setItem("username", username);
      txtUsername.value = "";
      txtPassword.value = "";
      lblUsername.textContent = username;
      divLogin.style.display = "none";
      divChat.style.display = "block";
      txtMessage.focus();

      connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7097/chatHub", {
          accessTokenFactory: () => {
            var localToken = localStorage.getItem("token");

            return localToken;
          },
        })
        .build();
      connection.on("ReceiveMessage", (username: string, message: string) => {
        const li = document.createElement("li");
        li.textContent = `${username}: ${message}`;
        const messageList = document.getElementById("messages");
        messageList.appendChild(li);
        messageList.scrollTop = messageList.scrollHeight;
      });

      connection.on("UserConnected", (username: string) => {
        const li = document.createElement("li");
        li.textContent = `${username} connected`;
        const messageList = document.getElementById("messages");
        messageList.appendChild(li);
        messageList.scrollTop = messageList.scrollHeight;
      });

      connection.on("UserDisconnected", (username: string) => {
        const li = document.createElement("li");
        li.textContent = `${username} disconnected`;
        const messageList = document.getElementById("messages");
        messageList.appendChild(li);
        messageList.scrollTop = messageList.scrollHeight;
      });

      await connection.start();
      btnSend.disabled = false;
    } catch (err) {
      console.error(err.toString());
    }
  }
}
txtMessage.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
btnSend.addEventListener("click", sendMessage);
function sendMessage() {
  connection
    .invoke("SendMessage", lblUsername.textContent, txtMessage.value)
    .catch((err) => console.error(err.toString()))
    .then(() => (txtMessage.value = ""));

  if (txtToGroup.value && txtToGroup.readOnly === true) {
    connection
      .invoke(
        "SendMessageToGroup",
        lblUsername.textContent,
        txtToGroup.value,
        txtMessage.value
      )
      .catch((err) => console.error(err.toString()))
      .then(() => (txtMessage.value = ""));
  } else if (txtToUser.value) {
    connection
      .invoke(
        "SendMessageToUser",
        lblUsername.textContent,
        txtToUser.value,
        txtMessage.value
      )
      .catch((err) => console.error(err.toString()))
      .then(() => txtMessage.value == "");
  } else {
    connection
      .invoke("SendMessage", lblUsername.textContent, txtMessage.value)
      .catch((err) => console.error(err.toString()))
      .then(() => (txtMessage.value = ""));
  }
}
