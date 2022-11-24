require('esbuild').buildSync({
  entryPoints: ['./src/index.ts'],
  target: 'ES2015',
  bundle: true,
  platform: 'neutral',
  minify: true,
  outdir: './publish/lib',
  outExtension: { '.js': '.mjs' }
})
