import esbuild from 'esbuild';
import resolve from 'esbuild-plugin-resolve';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import textReplace from 'esbuild-plugin-text-replace'

await esbuild.build({
    entryPoints: ['./app.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/cloudflare-workers-min.js',
    external: [],
    plugins: [
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
    ],
    minify: true,
});

await esbuild.build({
    entryPoints: ['./app.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/cloudflare-workers.js',
    external: [],
    plugins: [
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
    ],
});

await esbuild.build({
    entryPoints: ['./deno.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/deno.js',
    external: [],
    plugins: [
        textReplace({
            include: new RegExp("src/providers/netease/crypto\.js"),
            pattern: [
                ["import crypto from 'crypto-browserify'", "import crypto from 'https://esm.sh/crypto-browserify@3.12.0'"],
                ["import { Buffer } from 'buffer/index.js'","import { Buffer } from 'https://esm.sh/buffer@6.0.3'"]
            ]
        }),
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),

    ],
    // minify: true,
});

// EdgeOne Pages build - copy node-functions to dist
import fs from 'fs';
import path from 'path';

// Ensure node-functions directory exists in dist
const nodeFunctionsDir = path.join(process.cwd(), 'dist', 'node-functions');
if (!fs.existsSync(nodeFunctionsDir)) {
    fs.mkdirSync(nodeFunctionsDir, { recursive: true });
}

// Copy node-functions files to dist
const sourceNodeFunctionsDir = path.join(process.cwd(), 'node-functions');
if (fs.existsSync(sourceNodeFunctionsDir)) {
    const files = fs.readdirSync(sourceNodeFunctionsDir);
    for (const file of files) {
        const sourcePath = path.join(sourceNodeFunctionsDir, file);
        const destPath = path.join(nodeFunctionsDir, file);
        fs.copyFileSync(sourcePath, destPath);
    }
}
