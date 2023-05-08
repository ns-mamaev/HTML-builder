const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const {
  stdin: input,
  stdout: output,
} = process;
const filePath = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

function handleExit() {
  output.write('\ngoodbye!\n');
  exit();
}

input.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    handleExit();
  }
  writeStream.write(chunk);
})

process.on('SIGINT', handleExit);

output.write('Please input some text, or "exit" for exit\n');
