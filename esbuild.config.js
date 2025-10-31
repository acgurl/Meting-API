import fs from 'fs';
import path from 'path';

console.log('Building for EdgeOne Pages...');

// Create dist directory
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Ensure node-functions directory exists in dist
const nodeFunctionsDir = path.join(distDir, 'node-functions');
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
        console.log(`Copied ${file} to dist/node-functions/`);
    }
}

console.log('EdgeOne Pages build completed!');
