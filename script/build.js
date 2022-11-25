import process from 'process'
import esbuild from 'esbuild'
// const process = require('process')
// const esbuild = require('esbuild')

let platform = 'neutral'
let outExtension = { '.js': '.mjs' }

if (process.argv[2] !== 'esm') {
  platform = 'node'
  outExtension = {}
}

esbuild.buildSync({
  entryPoints: ['./src/index.ts'],
  target: 'ES2015',
  bundle: true,
  minify: true,
  outdir: './publish/lib',
  platform,
  outExtension
})
