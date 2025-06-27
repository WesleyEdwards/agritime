// import esbuild from "esbuild"
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: './dist/index.js',
  minify: true,
  sourcemap: false,
  metafile: true,
  define: {
    'process.env.ENV_PATH': '".env.production"'
  }
}).then(() => {
  console.log("Successfully built")
}).catch(() => process.exit(1));