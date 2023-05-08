const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');


async function mergeStyle(sourcePath, targetPath) {
  try {
    const items = await readdir(sourcePath, { withFileTypes: true });
    const stylesFiles = items.filter((item) => item.isFile() && path.extname(item.name) === '.css');
    
    const output = fs.createWriteStream(targetPath);

    for (const styleFile of stylesFiles) {
      const input = fs.createReadStream(path.resolve(sourcePath, styleFile.name), 'utf-8');
      input.pipe(output);
    }

  } catch (err) {
    console.error(err);
  }
}

const sourcePath = path.resolve(__dirname, 'styles');
const targetPath = path.resolve(__dirname, 'project-dist', 'bundle.css');
mergeStyle(sourcePath, targetPath);
