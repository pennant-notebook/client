## Development

Pennant is a multi-repository project, each handling a different aspect of the application. To set up the entire Pennant environment, follow these steps for each repository:

### Repositories

- **[Webserver](https://github.com/pennant-notebook/server)**: Manages a DynamoDB REST API for user and notebook metadata.
- **[Node Execution Engine](https://github.com/pennant-notebook/pennant-engine)**: Handles JavaScript code execution.
- **[Flask Server](https://github.com/marwan37/pennant-flask-server)**: Manages Python code execution.
- **[WebSocket Provider Server](https://github.com/pennant-notebook/pennant-provider)**: Manages collaboration features and notebook persistence to S3.

### General Setup

1. **Clone Each Repository**:
   For each component, clone its repository:

   ```bash
   git clone [repository URL]
   ```

2. **Install Dependencies**:
   Navigate to each cloned directory and install NPM packages:

   ```bash
   cd [repository directory]
   npm install
   ```

3. **Configure Environment**:
   Set up a `.env` file in each project root. Use the `.env.example` file as a template and fill in the necessary environment variables.

4. **Running Each Component**:
   Follow the specific instructions in each repository's [README.md](#) to start the server or service.

### Specific Instructions

- **Webserver**: Follow the instructions in the [server README.md](https://github.com/pennant-notebook/server/blob/main/README.md) to set up and run the DynamoDB REST API.
- **Node Execution Engine**: The [engine README.md](https://github.com/pennant-notebook/pennant-engine/blob/main/README.md) contains details for setting up and running the JavaScript code execution engine.
- **Flask Server**: Instructions for setting up and running the Python code execution engine are in the [Flask server README.md](https://github.com/marwan37/pennant-flask-server/blob/main/README.md).
- **WebSocket Provider Server**: The [provider README.md](https://github.com/pennant-notebook/pennant-provider/blob/main/README.md) guides you through setting up and running the WebSocket provider for collaboration features.

Ensure each component is properly configured and running to have a fully operational Pennant environment.
