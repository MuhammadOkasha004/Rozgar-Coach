import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];

const chromeExe = chromePaths.find((p) => existsSync(p));

function openChrome() {
  return {
    name: 'open-chrome',
    configureServer(server: any) {
      if (!chromeExe) return;
      server.httpServer?.once('listening', () => {
        spawn(chromeExe, [`http://localhost:${server.config.server.port}`], {
          detached: true,
          stdio: 'ignore',
        }).unref();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), openChrome()],
  server: {
    port: 5173,
    host: true,
  },
});
