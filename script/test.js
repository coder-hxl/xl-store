require('esbuild')
  .build({
    entryPoints: ['./test/index.ts'],
    target: 'ESNext',
    bundle: true,
    platform: 'neutral',
    minify: true,
    outdir: './test',
    watch: true,
    loader: {
      '.ts': 'ts'
    }
  })
  .then((res) => {
    console.log('watching...')
  })
