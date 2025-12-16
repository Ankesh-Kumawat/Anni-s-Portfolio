// Vercel Serverless Function
const path = require('path');

// Load the built server
const serverPath = path.join(process.cwd(), 'dist', 'index.cjs');
const app = require(serverPath).default || require(serverPath);

module.exports = app;
