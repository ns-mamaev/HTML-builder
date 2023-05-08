const { copyFile} = require('fs');
const path = require('path');
const { readdir, mkdir, rm } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'files');

async function makeDirectory(targetFolder) {
  const dirCreation = await mkdir(targetFolder, { recursive: true });
  
  return dirCreation;
}

function makeFileCopy(source, target) {
  copyFile(source, target, (err) => {
    if (err) throw err;
  }); 
}

// main function
async function makeDirCopy() {
  const copyFolderName = folderPath + '-copy';
  try {
    makeDirectory(copyFolderName);
    const items = await readdir(folderPath, { withFileTypes: true });
    for (const item of items) {
      const { name } = item;
      if (item.isFile()) {
        const source = path.resolve(folderPath, name);
        const target = path.resolve(copyFolderName, name);
        makeFileCopy(source, target);
      }
    }
    // remove old files
    const copyItems = await readdir(copyFolderName, { withFileTypes: true });
    const newItemsNames = items.map(item => item.name);
    for (const copy of copyItems) {
      const { name } = copy;
      if (!newItemsNames.includes(name)) {
        if (copy.isFile()) {
          rm(path.resolve(copyFolderName, name));
        }
      }
    }

  } catch (err) {
    console.log(err);
  }
};

makeDirCopy();
