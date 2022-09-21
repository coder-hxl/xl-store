require("esbuild").buildSync({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  minify: true,
  outdir: "./publish/lib",
  // outExtension: { ".js": ".mjs" },
});
