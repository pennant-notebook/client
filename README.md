230705-2 - version 0.1.2-stable (branch) stable version with internal dredd execution engine plus engine reset button  
230705-1 - version 0.1.1-stable (branch) stable version with internal dredd execution engine  
230705-0 - version 0.1 This branch is deployed to latest.trypennant.com as pennantmvp2.fly.dev\*\*\*\*  

# Pennant-Client

This repository contains the React application for the pennant-notebook project.

## Getting Started

### Prerequisites

You will need to create a `.env` file in the client folder with the following environment variables:

```env
VITE_WEBSOCKET_SERVER=<websocket server url, see provider repo for more details>
VITE_HP_ACCESS_TOKEN=<token for the hocuspocus provider, see provider repo -> pocus directory for more details>
VITE_ENGINE_SERVER=<code execution engine url, see code-engine repo for more details>
VITE_API_URL=<dynamodb api url, see webserver repo for more details>
```

### Installation
Clone the repo

```bash
git clone https://github.com/pennant-notebook/client.git
```

Install NPM packages

```bash
npm install
```

### Usage
To start the development server, run:

```bash
npm start
```

### Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

### License
MIT License

