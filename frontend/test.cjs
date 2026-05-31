const { JSDOM } = require('jsdom');
const path = require('path');

JSDOM.fromFile(path.join(__dirname, 'dist', 'index.html'), {
  resources: 'usable',
  runScripts: 'dangerously',
  url: 'http://localhost'
}).then(dom => {
  dom.window.addEventListener('error', event => {
    console.error('JSDOM ERROR:', event.error);
  });
  dom.window.addEventListener('unhandledrejection', event => {
    console.error('JSDOM UNHANDLED REJECTION:', event.reason);
  });
  setTimeout(() => {
    console.log('JSDOM FINISHED', dom.window.document.body.innerHTML.substring(0, 500));
    process.exit(0);
  }, 5000);
}).catch(console.error);
