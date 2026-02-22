const esbuild = require('esbuild')
const esbuildPluginPino = require('esbuild-plugin-pino')
const fs = require('fs')
const path = require('path')

console.log('Building Backend')

// Copy migrations folder to dist, so they can be applied at startup
const migrationsSource = path.join(__dirname, 'migrations')
const migrationsDest = path.join(__dirname, '../../dist/backend/migrations')

fs.cpSync(migrationsSource, migrationsDest, { recursive: true })
console.log('✓ Copied migrations folder to dist/backend/migrations')

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
    // As we bundle pino as separate files, this is necessary
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    plugins: [esbuildPluginPino()],
    external: []
  })
  .then(() => {
    console.log('Build Successful')
  })
  .catch((err) => {
    console.error('❌ Build Failed:', err)
    process.exit(1)
  })
