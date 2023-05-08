const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const folderPath = path.resolve(__dirname, 'secret-folder');

(async function () {
  try {
    const items = await readdir(folderPath, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        const { name } = item;
        fs.stat(path.resolve(folderPath, name), (err, { size }) => {
          if (err) throw err;
          const sizeKb = +(size / 1024).toFixed(3);
          const extension = path.extname(name).slice(1);
          const fileName = name.slice(0, name.lastIndexOf(extension) - 1);
          const outputString = `${fileName} - ${extension} - ${sizeKb}kb`;
          console.log(outputString);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
