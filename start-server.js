#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor do projeto...\n');

console.log('📝 Aplicando configurações...');
const applyConfig = spawn('node', ['apply-config.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

applyConfig.on('close', (code) => {
  if (code === 0) {
    
    const server = spawn('http-server', ['-p', '8080', '-o'], {
      stdio: 'inherit',
      cwd: __dirname
    });

    server.on('close', (code) => {
    });

    // Captura Ctrl+C para fechar graciosamente
    process.on('SIGINT', () => {
      server.kill('SIGINT');
      process.exit(0);
    });

  } else {
    process.exit(1);
  }
});