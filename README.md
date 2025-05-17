# Signal-R-Chat-app
🔴This project is unhosted

This is a full stack project comprising of two parts:
1) A typescript client with simple HTML
2) A C# server with SignalR for real-time capabilities

To run the client:
1) Change the project directory to the ```ChatApp.TypescriptClient``` folder
   ```bash
   cd ChatApp.TypescriptClient
   ```
2) In the folder you can run:
   ```bash
   npm run gulp
   ```
   This will build and bundle the typescript files (incase you make you own customizations)

To run the server:
1) Change the project directory to the ```ChatApp.Server``` folder and ensure to run it as https
   ```bash
   cd ChatApp.Server
   dotnet run --launch-profile https
   ```

   