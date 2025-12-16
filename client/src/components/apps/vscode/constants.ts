import { FileNode } from "./types";

export const APP_TSX_CONTENT = `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;`;

export const CSS_CONTENT = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0f0f0f;
  color: #ffffff;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
}`;

export const MAIN_TSX_CONTENT = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

export const PACKAGE_JSON_CONTENT = `{
  "name": "portfolio-os",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}`;

export const TSCONFIG_CONTENT = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

export const VITE_CONFIG_CONTENT = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});`;

export const README_CONTENT = `# Portfolio OS

A modern portfolio website built with React, TypeScript, and Vite.

## Features

- ⚡️ Lightning fast with Vite
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🎯 TypeScript for type safety
- 🚀 Optimized production build

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## License

MIT`;

export const FILE_TREE: FileNode[] = [
    {
        name: "src",
        type: "folder",
        children: [
            { name: "App.tsx", type: "file", icon: "tsx", content: APP_TSX_CONTENT },
            { name: "main.tsx", type: "file", icon: "tsx", content: MAIN_TSX_CONTENT },
            { name: "index.css", type: "file", icon: "css", content: CSS_CONTENT },
            {
                name: "components",
                type: "folder",
                children: [
                    { name: "Header.tsx", type: "file", icon: "tsx" },
                    { name: "Footer.tsx", type: "file", icon: "tsx" },
                ],
            },
            {
                name: "pages",
                type: "folder",
                children: [
                    { name: "Home.tsx", type: "file", icon: "tsx" },
                    { name: "About.tsx", type: "file", icon: "tsx" },
                ],
            },
        ],
    },
    { name: "package.json", type: "file", icon: "json", content: PACKAGE_JSON_CONTENT },
    { name: "tsconfig.json", type: "file", icon: "json", content: TSCONFIG_CONTENT },
    { name: "vite.config.ts", type: "file", icon: "ts", content: VITE_CONFIG_CONTENT },
    { name: "README.md", type: "file", icon: "md", content: README_CONTENT },
    { name: "index.html", type: "file", icon: "html" },
    { name: ".gitignore", type: "file", icon: "txt" },
];
