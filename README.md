# Book-Finder-Application
https://sonar.server.examly.io/dashboard?id=iamneo-production-2_Book-Finder-Application&amp;codeScope=overall

## How to Run

### Prerequisites
- .NET 6.0 SDK or later
- Node.js & npm
- MSSQL Server (running and accessible via the connection string in `dotnetapp/appsettings.Development.json`)

### 1. Start the Backend (API)
1. Open a terminal in VS Code.
2. Navigate to the dotnet directory:
   ```bash
   cd dotnetapp
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
   The backend will start at `http://localhost:8080`.

### 2. Start the Frontend (React Client)
1. Open a **new** terminal in VS Code (split terminal or new tab).
2. Navigate to the react directory:
   ```bash
   cd reactapp
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The frontend will start at `http://localhost:8081`.

### 3. Access the Application
Open your browser and visit: [http://localhost:8081](http://localhost:8081)
