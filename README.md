# Pennant (client)

This repository contains the React application for the pennant-notebook project.

(rewritten in TypeScript for improved maintainability.)

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

## Main Components

### App (`src/App.tsx`)

- Main entry point for the application.
- Manages themes and routing.
- Includes routes for landing page, user dashboard, and individual notebooks.

### Cells (`src/components/Cells/Cells.tsx`)

- Responsible for rendering and managing notebook cells.
- Supports drag-and-drop functionality for reordering cells using `react-dnd` & `react-dnd-html5-backend`.

### Code Cell (`src/components/Code/CodeCell.tsx`)

- Represents a code cell within the notebook.
- Each code cell utilizes its own code editor (CodeMirror 6) instance.
- Editor binding created using `y-codemirror.next`.
- Handles code execution, output rendering, and toolbar actions.

### Markdown Cell (`src/components/Markdown/MarkdownCell.tsx`)

- Represents a markdown cell within the notebook.
- Includes a markdown editor (BlockNote) and toolbar.
- Editor binding created using `collab` plugin.

### Notebook (`src/components/Notebook/Notebook.tsx`)

- Main component for rendering and managing the notebook interface.
- Manages cells, navigation, and collaboration features.

## Services

### Dredd Execution Service (`src/services/dreddExecutionService.ts`)

- Provides functions for interacting with the Dredd execution engine.
- Handles code execution, status checking, context resetting, and formatting cells for execution.

### DynamoDB Service (`src/services/dynamoFetch.ts` and `dynamoPost.ts`)

- Contains functions that make API calls to fetch notebook and user metadata from DynamoDB.

### Notebook Helpers (`src/utils/notebookHelpers.ts`)

- Utility functions for creating and managing notebook content.
- Includes functions for creating cells (`Y.Map`) and managing user objects.

## Contexts

### Provider Context (`src/contexts/ProviderContext.ts`)

- Initializes the client-side Websocket-Provider (`HocuspocusProvider`) and the Yjs Document (`Y.Doc`).
- Initializes an instance of `IndexeddbPersistence` and syncs it with the `Y.Doc` and provider.

### Notebook Context (`src/contexts/NotebookContext.ts`)

- Contains notebook metadata, provider, awareness, doc and the `docID` for a given notebook.
- Contains various functions for adding, deleting, cloning, and repositioning cells.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
