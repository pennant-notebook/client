# Contributing to Pennant

Welcome to Pennant - a real-time collaborative notebook platform! This guide will help you set up the development environment and understand our contribution process.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.8+)
- **Docker** (for code execution engines)
- **AWS CLI** (optional, for production S3 storage)

### 1. Set Up Development Structure

Pennant consists of multiple repositories that work together. For local development, organize them in a single directory:

```bash
# Create a parent directory for all Pennant repositories
mkdir pennant-core
cd pennant-core

# Clone all repositories
git clone https://github.com/pennant-notebook/client.git
git clone https://github.com/pennant-notebook/server.git
git clone https://github.com/pennant-notebook/pennant-provider.git hocuspocus
git clone https://github.com/pennant-notebook/pennant-engine.git
git clone https://github.com/marwan37/pennant-flask-server.git

# Install dependencies for each service
cd client && npm install && cd ..
cd server && npm install && cd ..
cd hocuspocus && npm install && cd ..
cd pennant-engine && npm install && cd ..
cd pennant-flask-server && pip install -r requirements.txt && cd ..
```

This creates the following structure:

```
pennant-core/
├── client/                 # React frontend application
├── server/                 # Express.js backend API
├── hocuspocus/            # WebSocket server (pennant-provider)
├── pennant-engine/        # JavaScript code execution service
└── pennant-flask-server/  # Python code execution service
```

### 2. Start Development Environment

From the `pennant-core` directory:

**For local development** (recommended):

```bash
# Start core services
cd client && npm run dev &
cd ../server && npm run dev &
cd ../hocuspocus && npm run dev:local &
```

**For code execution** (optional):

```bash
# Terminal 2: Python execution engine
cd pennant-flask-server && python app.py

# Terminal 3: JavaScript execution engine (requires Docker setup)
docker network create dredd-network
docker run -d --name redis-dredd --network dredd-network -p 6379:6379 redis
docker run -d --name rabbitmq-dredd --network dredd-network -p 5672:5672 rabbitmq
cd pennant-engine/worker && docker build -t node-worker .
cd ../server && npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **WebSocket Server**: http://localhost:8080
- **Python Engine**: http://localhost:7070
- **JavaScript Engine**: http://localhost:3002

## 🔧 Development Services

### Core Services (Always Required)

| Service        | Port | Repository                                                               | Purpose                 |
| -------------- | ---- | ------------------------------------------------------------------------ | ----------------------- |
| **Client**     | 3000 | [client](https://github.com/pennant-notebook/client)                     | React frontend          |
| **Server**     | 3001 | [server](https://github.com/pennant-notebook/server)                     | Express API backend     |
| **HocusPocus** | 8080 | [pennant-provider](https://github.com/pennant-notebook/pennant-provider) | WebSocket collaboration |

### Code Execution Services (Optional)

| Service               | Port | Repository                                                               | Purpose                   |
| --------------------- | ---- | ------------------------------------------------------------------------ | ------------------------- |
| **Python Engine**     | 7070 | [pennant-flask-server](https://github.com/marwan37/pennant-flask-server) | Python code execution     |
| **JavaScript Engine** | 3002 | [pennant-engine](https://github.com/pennant-notebook/pennant-engine)     | JavaScript code execution |

## 🧪 Testing

From the client directory:

```bash
cd client/

# Testing commands
npm test                # Unit tests (Vitest)
npm run test:unit       # Unit tests only
npm run test:component  # Component tests (Playwright CT)
npm run test:e2e        # End-to-end tests (Playwright)
npm run test:all        # All tests
```

## 🔍 Code Quality

### Linting and Type Checking

```bash
cd client/
npm run lint            # Check code quality
npm run build          # Type checking via build
```

## 🤝 Contributing Guidelines

1. **Fork the repository** you want to contribute to
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Run tests**: `npm run test:all` (for client) or appropriate test command
4. **Run linting**: `npm run lint` (where available)
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** in the appropriate repository

### Code Style

- **TypeScript**: Strict typing enabled
- **React**: Functional components with hooks
- **Imports**: Use `@/` for types, `~/` for src files
- **Testing**: Add tests for new features
- **Linting**: Follow ESLint configuration

## 🔐 Environment Configuration

### Client Environment (`.env`)

```bash
# WebSocket server
VITE_WEBSOCKET_SERVER=http://localhost:8080

# Code execution engines
VITE_ENGINE_SERVER=http://localhost:3002     # JavaScript
VITE_FLASK_SERVER=http://localhost:7070      # Python

# Authentication (optional)
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Server Environment (`.env`)

```bash
# AWS Configuration (for production)
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Database
DATABASE_URL=your_database_url
```

## 🐛 Troubleshooting

### Common Issues

#### "Tree view not showing notebooks"

- Ensure all core services are running
- Check browser console for API errors
- Verify backend database connection

#### "Code execution not working"

**For Python:**

- Check if Flask server is running on port 7070
- Verify Python dependencies: `pip install -r requirements.txt`
- Check `VITE_FLASK_SERVER` environment variable

**For JavaScript:**

- Ensure Docker is running
- Check containers: `docker ps`
- Build worker image: `cd pennant-engine/worker && docker build -t node-worker .`
- Verify `node-worker` image exists: `docker images | grep node-worker`

#### "WebSocket connection failed"

- Ensure HocusPocus server is running on port 8080
- Check `VITE_WEBSOCKET_SERVER` environment variable

### Logs and Debugging

```bash
# Check service status
docker ps                    # Docker containers
lsof -i :3000               # Port usage

# View logs
docker logs redis-dredd     # Redis logs
docker logs rabbitmq-dredd  # RabbitMQ logs
```

## 📚 Architecture Overview

### Frontend (React + TypeScript)

- **State Management**: Recoil
- **Styling**: CSS Modules + Material-UI
- **Real-time**: Y.js for collaborative editing
- **Code Editor**: CodeMirror 6

### Backend (Node.js + Express)

- **Database**: DynamoDB (production) / SQLite (local)
- **Authentication**: JWT + OAuth (GitHub, Google)
- **API**: RESTful endpoints

### Real-time Collaboration

- **WebSocket**: HocusPocus server
- **CRDT**: Yjs for conflict-free collaborative editing
- **Storage**: S3 (production) / SQLite (local)

### Code Execution

- **Python**: Flask server with isolated execution
- **JavaScript**: Docker-based worker queue system
- **Security**: Sandboxed execution environments

## 💡 Need Help?

- **Issues**: Create a GitHub issue in the appropriate repository
- **Development**: Check the troubleshooting section above
