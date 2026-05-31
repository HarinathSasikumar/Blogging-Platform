const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body><div id="root"></div></body></html>', {
  url: 'https://blogging-platform-frontend-12p3.onrender.com/'
});

dom.window.addEventListener('error', event => {
  console.error('JSDOM WINDOW ERROR:', event.error);
});
dom.window.addEventListener('unhandledrejection', event => {
  console.error('JSDOM UNHANDLED REJECTION:', event.reason);
});

// Mock some browser APIs that might be missing in JSDOM
dom.window.matchMedia = dom.window.matchMedia || function() {
  return { matches: false, addListener: function() {}, removeListener: function() {} };
};
dom.window.requestAnimationFrame = dom.window.requestAnimationFrame || function(callback) {
  return setTimeout(callback, 0);
};

const files = fs.readdirSync(path.join(__dirname, 'dist', 'assets')).filter(f => f.endsWith('.js'));
const code = fs.readFileSync(path.join(__dirname, 'dist', 'assets', files[0]), 'utf8');

try {
  dom.window.eval(code);
} catch (err) {
  console.error('EVAL ERROR:', err);
}

setTimeout(() => {
  console.log('JSDOM FINISHED', dom.window.document.body.innerHTML.substring(0, 500));
}, 2000);
