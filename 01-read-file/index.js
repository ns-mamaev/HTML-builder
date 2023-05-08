const fs = require('fs');
const path = require('path');
const { stdout } = process;

const readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

readStream.on('error', (error) => console.log('Error', error.message));
readStream.pipe(stdout);
