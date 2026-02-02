// Vercel Serverless Function - ES Module
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load the built server
const serverPath = join(process.cwd(), 'dist', 'index.cjs');
const app = require(serverPath).default || require(serverPath);

export default app;
