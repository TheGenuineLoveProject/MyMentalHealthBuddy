/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  // Add custom VITE_ prefixed env vars here
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
