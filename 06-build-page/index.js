const fs = require('fs');
const path = require('path');
const { makeDirCopy } = require('../04-copy-directory'); // импортируется модуль из 4 задания
const { mergeStyle } = require('../05-merge-styles'); // импортируется модуль из 5 задания

function buildHtml() {
  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '', (err) => {
    if (err) console.log(err);
  });
  let mainHtml = '';
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readStream.on('data', (chunk) => (mainHtml += chunk));
  readStream.on('end', () => {
    const componentsNames = mainHtml.match(/{{(.*?)}}/g);
    if (componentsNames.length > 0) {
      for (const name of componentsNames) {
        let componentHtml = '';
        const compReadStream = fs.createReadStream(
          path.resolve(__dirname, 'components', `${name.slice(2, -2)}.html`),
          'utf-8',
        );
        compReadStream.on('data', (chunk) => (componentHtml += chunk));
        compReadStream.on('end', () => {
          const [begin, ...rest] = mainHtml.split(name);
          mainHtml = rest.join();
          fs.appendFile(
            path.resolve(__dirname, 'project-dist', 'index.html'),
            begin + componentHtml,
            (err) => {
              if (err) console.error(err);
            },
          );
        });
      }
    }
  });
}

function buildPage(distPath) {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) throw err;
    makeDirCopy(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    mergeStyle(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
    buildHtml();
  });
}

const distPath = path.resolve(__dirname, 'project-dist');
buildPage(distPath);
