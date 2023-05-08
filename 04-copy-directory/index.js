const { copyFile} = require('fs');
const path = require('path');
const { readdir, mkdir, rm } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'files');

// main function
async function makeDirCopy(sourcePath, distPath) {
  try {
    await mkdir(distPath, { recursive: true });
    const items = await readdir(sourcePath, { withFileTypes: true });
    for (const item of items) {
      const { name } = item;
      const source = path.resolve(sourcePath, name);
      const target = path.resolve(distPath, name);
      if (item.isFile()) {
        copyFile(source, target, (err) => {
          if (err) throw err;
        }); 
      }
      if (item.isDirectory()) {
        // recoursive copy with nested folders
        makeDirCopy(source, target);
      } 
    }
    // remove old files
    const copyItems = await readdir(distPath, { withFileTypes: true });
    const newItemsNames = items.map(item => item.name);
    for (const copy of copyItems) {
      const { name } = copy;
      if (!newItemsNames.includes(name)) {
        if (copy.isFile()) {
          await rm(path.resolve(distPath, name));
        }
      }
    }

  } catch (err) {
    console.log(err);
  }
};

makeDirCopy(folderPath, folderPath + '-copy');

module.exports = {
  makeDirCopy,
}
