await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/index.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: distDir,
  outExtension: { ".js": ".mjs" },

  minify: true,
  treeShaking: true,
  keepNames: false,

  sourcemap: false,

  external: [
    "*.node",
    "express",
    "@workspace/db",
    "@workspace/api-zod",
    "sharp",
    "bcrypt",
    "argon2"
  ],

  plugins:
    process.env.NODE_ENV === "production"
      ? []
      : [esbuildPluginPino({ transports: ["pino-pretty"] })],

  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
globalThis.require = __bannerCrReq(import.meta.url);`
  }
});
