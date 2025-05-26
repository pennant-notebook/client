interface ImportMeta {
  env: {
    VITE_WEBSOCKET_SERVER: string;
    VITE_WEBSOCKET_SERVER_DEV: string;
    VITE_HP_ACCESS_TOKEN: string;
    VITE_ENGINE_SERVER: string;
    VITE_ENGINE_SERVER_DEV: string;
    VITE_FLASK_SERVER: string;
    VITE_FLASK_SERVER_DEV: string;
    VITE_LSP_SERVER: string;
    VITE_GITHUB_CLIENT_ID: string;
    VITE_GITHUB_CLIENT_SECRET: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_GOOGLE_CLIENT_SECRET: string;
    DEV: boolean;
    [key: string]: string | boolean;
  };
}
