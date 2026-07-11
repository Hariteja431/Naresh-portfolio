const fs = require('fs');

function checkImage(path) {
  const buffer = Buffer.alloc(24);
  const fd = fs.openSync(path, 'r');
  fs.readSync(fd, buffer, 0, 24, 0);
  fs.closeSync(fd);
  
  // Very basic JPEG dimensions check (SOF0 marker)
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xFF && buffer[i+1] === 0xC0) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      console.log(`${path}: ${width}x${height}`);
      return;
    }
  }
  console.log(`${path}: Size check failed (might need full parse). File size: ${fs.statSync(path).size} bytes`);
}

checkImage('c:\\Desktop\\Naresh portfolio\\assets\\hero section 30fps imgs\\ezgif-frame-001.jpg');
