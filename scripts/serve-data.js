#!/usr/bin/env node

/**
 * Simple local server for serving custom city data
 *
 * Usage:
 *   node scripts/serve-data.js
 *   node scripts/serve-data.js --port 8080
 *   node scripts/serve-data.js --dir ./my-city-data
 *
 * This serves files from ./data/ by default at http://127.0.0.1:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let port = 8080;
let dir = path.join(__dirname, '..', 'data');

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
        port = parseInt(args[i + 1], 10);
        i++;
    } else if (args[i] === '--dir' && args[i + 1]) {
        dir = path.resolve(args[i + 1]);
        i++;
    }
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.geojson': 'application/geo+json',
};

// Create server
const server = http.createServer((req, res) => {
    // Add CORS headers (required for Subway Builder to fetch)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Parse URL
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';

    // Resolve file path
    const filePath = path.join(dir, urlPath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(dir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try adding .json extension
            const jsonPath = filePath + '.json';
            fs.stat(jsonPath, (err2, stats2) => {
                if (err2 || !stats2.isFile()) {
                    res.writeHead(404);
                    res.end(`Not found: ${urlPath}`);
                    console.log(`404: ${urlPath}`);
                    return;
                }
                serveFile(jsonPath, res);
            });
            return;
        }
        serveFile(filePath, res);
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Server error');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        console.log(`200: ${path.relative(dir, filePath)}`);
    });
}

// Start server
server.listen(port, '127.0.0.1', () => {
    console.log('');
    console.log('='.repeat(50));
    console.log('  Subway Builder City Data Server');
    console.log('='.repeat(50));
    console.log('');
    console.log(`  Serving: ${dir}`);
    console.log(`  URL:     http://127.0.0.1:${port}`);
    console.log('');
    console.log('  Use in your mod:');
    console.log('  window.SubwayBuilderAPI.registerCity({');
    console.log(`    dataUrl: 'http://127.0.0.1:${port}/MTL',`);
    console.log('    // ...other options');
    console.log('  });');
    console.log('');
    console.log('  Press Ctrl+C to stop');
    console.log('');
});

// Handle shutdown
process.on('SIGINT', () => {
    console.log('\nServer stopped');
    process.exit(0);
});
