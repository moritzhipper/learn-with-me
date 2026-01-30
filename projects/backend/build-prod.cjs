const esbuild = require('esbuild')
const esbuildPluginPino = require('esbuild-plugin-pino')

console.log('⚡ Building Backend (Native Resolution Mode)...')

esbuild
  .build({
    entryPoints: ['projects/backend/src/app.ts'],
    outdir: 'dist/backend/',
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    sourcemap: false,
    tsconfig: './projects/backend/tsconfig.prod.json',

    // Necessary for Node to handle __dirname and require() inside ESM files
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    plugins: [esbuildPluginPino({ transports: ['pino-pretty'] })],
    external: []
  })
  .then(() => {
    console.log('✅ Build Successful: dist/backend/app.js')
    console.log('🚀 Run with: node dist/backend/app.js')
  })
  .catch((err) => {
    console.error('❌ Build Failed:', err)
    process.exit(1)
  })
