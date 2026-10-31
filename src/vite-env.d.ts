/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional JSON endpoint for the contact form (Formspree, Getform, custom API). */
  readonly VITE_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
