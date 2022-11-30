import tsPlugin from 'rollup-plugin-typescript2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

const outputMap = [
  {
    file: 'publish/lib/index.js',
    format: 'cjs'
  },
  {
    file: 'publish/lib/index.mjs',
    format: 'es'
  }
].map((item) => {
  return { ...item, compact: true }
})

console.log(outputMap)

export default {
  input: 'src/index.ts',
  output: outputMap,
  plugins: [
    tsPlugin(),
    getBabelOutputPlugin({
      presets: [['@babel/preset-env', { bugfixes: true }]]
    })
  ]
}
