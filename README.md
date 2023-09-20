<p align="center">
  <a href="https://trypennant.com">
    <img src="https://pennant-notebook.github.io/images/logo/logo-name-horizontal-purple.png" alt="Pennant Notebook Logo" width="300"/>
  </a>
</p>
<p align="center">
 Welcome to Pennant! An Open-source Real-Time Collaborative Computational Notebook supporting Markdown and JavaScript.
</p>
<br />
<p align="center">
  <img src="https://pennant-notebook.github.io/images/11-opening-notebook-gif.gif" alt="Pennant Notebook Demo" width="500" />
</p>
<br />
<br />
<p align="center">
  <a href="https://pennant-notebook.github.io/" target="_blank">
    <img src="public/read-our-case-study.png" alt="Read Our Case Study" width="200" />
  </a>
</p>

## Overview

- **[Yjs](https://github.com/yjs/yjs)**: CRDT framework that enables real-time collaboration and synchronization between different users.
- **[y-indexeddb](https://github.com/yjs/y-indexeddb)**: Used for efficient caching and offline persistence.
- **[CodeMirror 6](https://github.com/codemirror/dev)**: Provides a versatile code editing environment, customized with various keybindings.
- **[y-codemirror.next](https://github.com/yjs/y-codemirror.next)**: Utilized to create the editor binding between Yjs and CodeMirror.
- **[Hocuspocus](https://github.com/ueberdosis/hocuspocus)**: Current provider in an architecture designed to be provider-agnostic, allowing for easy switching to other providers.
- **[y-protocols](https://github.com/yjs/y-protocols)**: Used to manipulate specific aspects of the awareness protocol.
- **[react-dnd](https://github.com/react-dnd/react-dnd)**: Powers the drag-and-drop functionality for cells.
- **[BlockNote](https://github.com/TypeCellOS/BlockNote)**: Markdown editor with customizations for a minimal design.
- **[Recoil](https://github.com/facebookexperimental/Recoil)**: Manages Auth0 and regular authentication states for the app.

## Getting started

### Prerequisites

Ensure you have a `.env` file set up in your project root. You can use the `.env.example` file in the repository as a template. Copy it and rename to `.env`, then fill in the necessary environment variables.

- `VITE_WEBSOCKET_SERVER`: Websocket-Provider server url (see pennant-provider repo for more details)
- `VITE_HP_ACCESS_TOKEN`: Provided when initializing the HocuspocusProvider (see pennant-provider/pocus repo for more details)
- `VITE_ENGINE_SERVER`: Code execution engine url (see pennant-engine repo for more details)

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

### Cells (`src/components/Cells`)

- Responsible for rendering and managing notebook cells.
- Supports drag-and-drop functionality for reordering cells using `react-dnd` & `react-dnd-html5-backend`.

### Code Cell (`src/components/Code`)

- Represents a code cell within the notebook.
- Each code cell utilizes its own code editor (CodeMirror 6) instance.
- Editor binding created using `y-codemirror.next`.
- Handles code execution, output rendering, and toolbar actions.

### Markdown Cell (`src/components/Markdown`)

- Represents a markdown cell within the notebook.
- Includes a markdown editor (BlockNote) and toolbar.
- Editor binding created using `collab` plugin.

### Notebook (`src/components/Notebook`)

- Main component for rendering and managing the notebook interface.
- Manages cells, navigation, and collaboration features.

## Services

### Dredd Execution Service (`src/services/dreddExecutionService.ts`)

- Provides functions for interacting with the Dredd execution engine.
- Handles code execution, status checking, context resetting, and formatting cells for execution.

### DynamoDB Service (`src/services/dynamoFetch.ts` and `dynamoPost.ts`)

- Contains functions that make API calls to fetch notebook and user metadata from DynamoDB.

## Helpers & Utils

### Notebook Helpers (`src/utils/notebookHelpers.ts`)

- Utility functions for creating and managing notebook content.
- Includes functions for creating cells (`Y.Map`) and typings for various Yjs Data Types.
- Includes functions for creating content for cells (`Y.Text` for code, `Y.XmlFragment` for markdown)
- The only file where "yjs" is imported.

### Awareness Helpers (`src/utils/awarenessHelpers.ts`)

- Utility functions for creating and managing client objects and awareness states.
- Includes functions for creating users (`Y.Map`) and managing user objects.

## Contexts

### Provider Context (`src/contexts/ProviderContext.ts`)

- Initializes the client-side Websocket-Provider (`HocuspocusProvider`) and the Yjs Document (`Y.Doc`).
- Initializes an instance of `IndexeddbPersistence` and syncs it with the `Y.Doc` and provider.

### Notebook Context (`src/contexts/NotebookContext.ts`)

- Contains notebook metadata, provider, awareness, and the y.doc for a given notebook.
- Contains various functions for adding, deleting, cloning, and repositioning cells.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT
