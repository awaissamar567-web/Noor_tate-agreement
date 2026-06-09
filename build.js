const fs = require('fs');
const path = require('path');

// Recursive function to copy directory contents
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const sourcePath = path.join(from, element);
        const destPath = path.join(to, element);
        const stat = fs.lstatSync(sourcePath);
        
        if (stat.isFile()) {
            fs.copyFileSync(sourcePath, destPath);
        } else if (stat.isDirectory()) {
            copyFolderSync(sourcePath, destPath);
        }
    });
}

const distPath = path.join(__dirname, 'dist');

console.log('Starting build process...');

// Clean existing dist folder
if (fs.existsSync(distPath)) {
    console.log('Cleaning existing dist directory...');
    fs.rmSync(distPath, { recursive: true, force: true });
}

// Create fresh dist folder
fs.mkdirSync(distPath, { recursive: true });

// Copy files
const filesToCopy = ['index.html', 'style.css', 'app.js'];
filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    if (fs.existsSync(src)) {
        console.log(`Copying ${file} to dist...`);
        fs.copyFileSync(src, path.join(distPath, file));
    } else {
        console.warn(`Warning: ${file} not found in root!`);
    }
});

// Copy PDF folder if it exists
const pdfDir = path.join(__dirname, 'pdf');
if (fs.existsSync(pdfDir)) {
    console.log('Copying pdf directory to dist...');
    copyFolderSync(pdfDir, path.join(distPath, 'pdf'));
}

console.log('Build completed successfully! Dist folder is ready for deployment.');
