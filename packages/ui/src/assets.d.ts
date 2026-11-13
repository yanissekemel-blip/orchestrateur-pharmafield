// Brand images imported as URLs (bundled by the app's Vite).
declare module '*.png' {
  const url: string;
  export default url;
}
