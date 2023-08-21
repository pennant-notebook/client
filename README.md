# Pennant-Client

This repository contains the React application for the pennant-notebook project.

## Overview

- **[Yjs](https://github.com/yjs/yjs)**: CRDT framework that enables real-time collaboration and synchronization between different users.
- **[y-indexeddb](https://github.com/yjs/y-indexeddb)**: Used for efficient caching and offline persistence.
- **[CodeMirror 6](https://github.com/codemirror/dev)**: Provides a versatile code editing environment, customized with various keybindings.
- **[y-codemirror.next](https://github.com/yjs/y-codemirror.next)**: Utilized to create the editor binding between Yjs and CodeMirror.
- **[Hocuspocus](https://github.com/ueberdosis/hocuspocus)**: Current provider in an architecture designed to be provider-agnostic, allowing for easy switching to other providers.
- **[y-protocols](https://github.com/yjs/y-protocols)**: Used to manipulate specific aspects of the awareness protocol.
- **[react-dnd](https://github.com/react-dnd/react-dnd)**: Powers the drag-and-drop functionality for cells.
- **[BlockNote](https://github.com/TypeCellOS/BlockNote)**: Markdown editor customized with an added ImageBlock; some features omitted for a minimal and performant design.

## Getting started

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

