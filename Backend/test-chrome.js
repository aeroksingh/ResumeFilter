const fs = require('fs');
const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
].filter(Boolean);
const executablePath = possiblePaths.find(p => fs.existsSync(p));
console.log('Found Chrome at:', executablePath);
if (!executablePath) {
    console.error('No Chrome installation found.');
    process.exit(1);
}
console.log('Successfully located Chrome for local development.');
