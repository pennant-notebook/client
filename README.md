<p align="center">
  <a href="https://trypennant.com">
    <img src="https://pennant-notebook.github.io/images/logo/logo-name-horizontal-purple.png" alt="Pennant Notebook Logo" width="300"/>
  </a>
</p>
<p align="center">
 Welcome to Pennant! An Open-Source Computational Notebook Supporting Real-Time Collaboration and Flexible Code Execution in Markdown, JavaScript, and Python.
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

## Features

- **Real-Time Collaboration**: Powered by [Yjs](https://github.com/yjs/yjs), a CRDT that enables real-time collaboration and synchronization between different users.
- **Versatile Code Editing**: CodeMirror 6 provides a rich coding environment, integrated with Yjs for collaborative editing.
- **Offline Persistence**: Efficient caching and offline capabilities with [y-indexeddb](https://github.com/yjs/y-indexeddb).
- **Drag-and-Drop Functionality**: Powered by [react-dnd](https://github.com/react-dnd/react-dnd).
- **Markdown Support**: Enhanced markdown editing experience with [BlockNote](https://github.com/TypeCellOS/BlockNote).
- **Python Support**: Fully equipped to handle Python notebooks.
- **Shared Execution Context**: Facilitates collaborative coding where outputs are updated in real-time, and visible to all connected users.
- **Notebook-Style Code Execution**: Independently run cells or the full notebook, tailored for exploratory coding and enhanced learning.

## Quick Start

Pennant is structured as a multi-repo project for modular development and deployment. The instructions below are for the client repository only. For detailed setup instructions for all components, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

### Setup

### Prerequisites

- Set up a `.env` file in your project root using `.env.example` as a template.
- Fill in the necessary environment variables.

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

## Testing

- Comprehensive testing with [Playwright](https://playwright.dev/) for E2E and component tests.
- Tests are organized in the `__tests__` directory.

### Running Tests

For E2E tests:

```bash
npm run test:e2e
```

For component tests:

```bash
npm run test:ct
```

## Documentation

The preliminary documentation is available at [https://docs.trypennant.com](https://docs.trypennant.com).

Please feel free to explore and provide feedback to help us improve.

## Upcoming Features

Support for additional programming languages: Golang, Ruby

## Contributing

Feel free to submit issues, feature requests, or pull requests. Your contributions are highly valued and welcome. For detailed guidelines, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Our work builds upon the foundations laid by several outstanding open source projects:

- **[Yjs](https://yjs.dev/)**: The CRDT framework that enables RTC through its efficient shared data model and types.
- **[TypeScript](https://www.typescriptlang.org/)**: Our compiler and language toolkit.
- **[BlockNote](https://www.blocknotejs.org/)**: Markdown editor that powers our markdown cells.
- **[CodeMirror](https://codemirror.net/)**: The open source text editor that powers Chrome DevTools.
- **[JetBrains](https://jb.gg/OpenSourceSupport)**: For their generous support of our open source project.

## License

Pennant Notebook is MIT licensed.
