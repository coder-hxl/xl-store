const process = require('process')
const esbuild = require('esbuild')

const args = process.argv.slice(2)
let platform = 'neutral'
let outExtension = { '.js': '.mjs' }

if (args[0] !== 'esm') {
  platform = 'node'
  outExtension = {}
}

console.log({
  platform,
  outExtension
})

esbuild.buildSync({
  entryPoints: ['./src/index.ts'],
  target: 'ES2015',
  bundle: true,
  minify: true,
  outdir: './publish/lib',
  platform,
  outExtension
})
