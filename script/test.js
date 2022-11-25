import esbuild from 'esbuild'

esbuild.buildSync({
  entryPoints: ['./test/index.ts'],
  target: 'ESNext',
  bundle: true,
  platform: 'neutral',
  minify: true,
  outdir: './test',
  outExtension: { '.js': '.mjs' }
})
