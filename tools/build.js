// Sestavení Hudebního kvízu (spouštět: cd tools && npm install && npm run build)
//
// Zdroj:   src/index.html  – čitelný kód s JSX (dřív se překládal až v prohlížeči přes Babel)
// Výstup:  index.html, app.js, app.css v kořeni repozitáře – ty se commitují a Netlify je jen zveřejní
//
// Proč: překlad 1,2 MB JSX a generování Tailwind stylů přímo v telefonu zdržovaly start o ~9 s.
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.html');
const GENERATED_NOTE = 'VYGENEROVÁNO z src/index.html (cd tools && npm run build) – neupravuj ručně, změny dělej v src/index.html';

const src = fs.readFileSync(SRC, 'utf8');
const m = src.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!m) throw new Error('V src/index.html chybí <script type="text/babel">');

// 1) JSX -> JavaScript (jen React preset; cílem jsou moderní prohlížeče a Android WebView)
const out = babel.transformSync(m[1], {
  presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic' }]],
  babelrc: false, configFile: false, sourceType: 'script', comments: false, compact: false,
});
fs.writeFileSync(path.join(ROOT, 'app.js'), `// ${GENERATED_NOTE}\n` + out.code + '\n');

// 2) Tailwind CSS – jen třídy, které se v kódu opravdu používají
execFileSync(path.join(__dirname, 'node_modules', '.bin', 'tailwindcss'), [
  '-c', path.join(__dirname, 'tailwind.config.js'),
  '-i', path.join(__dirname, 'tailwind.css'),
  '-o', path.join(ROOT, 'app.css'),
  '--minify',
], { stdio: ['ignore', 'ignore', 'inherit'] });

// 3) index.html – místo Babelu a Tailwind CDN načte předpřipravené soubory; produkční React s pevnou verzí
let html = src.replace(m[0], '<script src="/app.js"></script>');
const replaceOnce = (from, to) => {
  if (typeof from === 'string' ? !html.includes(from) : !from.test(html)) throw new Error('Nenalezeno: ' + from);
  html = html.replace(from, to);
};
replaceOnce(/\s*<!--[^>]*Tailwind[^>]*-->\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '\n    <link rel="stylesheet" href="/app.css">');
replaceOnce('https://unpkg.com/react@18/umd/react.development.js', 'https://unpkg.com/react@18.3.1/umd/react.production.min.js');
replaceOnce('https://unpkg.com/react-dom@18/umd/react-dom.development.js', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js');
replaceOnce(/\s*<!--[^>]*Babel[^>]*-->\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone\/babel\.min\.js"><\/script>/, '');
replaceOnce('<head>', `<head>\n    <!-- ${GENERATED_NOTE} -->`);
for (const bad of ['cdn.tailwindcss.com', 'babel.min.js', 'text/babel', 'development.js']) {
  if (html.includes(bad)) throw new Error('Výstup stále obsahuje ' + bad);
}
fs.writeFileSync(path.join(ROOT, 'index.html'), html);

const kb = (f) => (fs.statSync(path.join(ROOT, f)).size / 1024).toFixed(0) + ' kB';
console.log(`Hotovo: index.html (${kb('index.html')}), app.js (${kb('app.js')}), app.css (${kb('app.css')})`);
