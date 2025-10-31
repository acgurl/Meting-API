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

// Also copy src directory to dist for imports
const copyDirectory = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

const srcDir = path.join(process.cwd(), 'src');
const distSrcDir = path.join(distDir, 'src');
if (fs.existsSync(srcDir)) {
    copyDirectory(srcDir, distSrcDir);
    console.log('Copied src directory to dist/');
}

console.log('EdgeOne Pages build completed!');
