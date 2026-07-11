const fs = require('fs');
const sizeOf = require('image-size');

const files = fs.readdirSync('public/images').filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
const res = files.reduce((acc, f) => {
  const dim = sizeOf('public/images/' + f);
  acc[f] = { w: dim.width, h: dim.height, ratio: dim.width / dim.height };
  return acc;
}, {});

console.log(JSON.stringify(res, null, 2));
