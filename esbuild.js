require("esbuild").buildSync({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "neutral",
  minify: true,
  outdir: "./publish/lib",
});
