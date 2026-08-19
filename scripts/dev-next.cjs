#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function sanitizeNodeOptions(value) {
  if (!value) return value;

  // Remove malformed --localstorage-file flags that break Next dev overlay on SSR.
  const sanitized = value
    .replace(/--localstorage-file(?:=(?:"[^"]+"|'[^']+'|\S+)|\s+(?:"[^"]+"|'[^']+'|\S+))?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return sanitized.length > 0 ? sanitized : undefined;
}

const env = { ...process.env };
const nodeOptions = sanitizeNodeOptions(env.NODE_OPTIONS);

if (nodeOptions) {
  env.NODE_OPTIONS = nodeOptions;
} else {
  delete env.NODE_OPTIONS;
}

const nextBin = require.resolve('next/dist/bin/next');
const localStorageFile = path.resolve(process.cwd(), '.next', 'node-localstorage.json');
fs.mkdirSync(path.dirname(localStorageFile), { recursive: true });

const args = ['--localstorage-file', localStorageFile, nextBin, 'dev', ...process.argv.slice(2)];

const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
