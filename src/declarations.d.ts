declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.JPG" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*&imagetools" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_SHEETS_API_KEY: string;
  readonly VITE_OFFICERS_SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
