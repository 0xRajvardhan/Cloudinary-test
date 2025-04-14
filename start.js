
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Image Vault Express...');

// Start the backend server
console.log('📡 Starting backend server...');
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit'
});

// Start the frontend server
console.log('🖥️ Starting frontend server...');
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('👋 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

console.log('✅ Both servers started successfully!');
console.log('📝 Backend running on: http://localhost:5000');
console.log('🌐 Frontend running on: http://localhost:8080');
console.log('👉 Press Ctrl+C to stop both servers');
