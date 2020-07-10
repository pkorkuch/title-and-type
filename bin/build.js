
const fs = require('fs');
const path = require('path');

const md = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const { Readable } = require('stream');
const readline = require('readline');

const sass = require('sass');

const inputPath = path.resolve(path.join(__dirname, '../content'));
const staticPath = path.resolve(path.join(__dirname, '../static'));
const outputPath = path.resolve(path.join(__dirname, '../build'));

const templates = require('../static/templates/main.html');

console.log('Input path: ' + inputPath);
console.log('Output path: ' + outputPath);

if (!fs.existsSync(inputPath)) {
    process.exit(1);
}

const inputFiles = fs.readdirSync(inputPath).filter((fileName) => path.extname(fileName) === '.md');

console.log('Found: ' + inputFiles);

fs.rmdirSync(outputPath, { recursive: true });
fs.mkdirSync(outputPath);
fs.mkdirSync(path.join(outputPath, 'stylesheets'));
fs.mkdirSync(path.join(outputPath, 'fonts'));

for (inputFile of inputFiles) {
    console.log('Compiling: ' + inputFile);
    const fileString = fs.readFileSync(path.join(inputPath, inputFile), 'utf8');

    const renderedHtml = md(fileString);
    const sanitizedHtml = purify.sanitize(renderedHtml);

    console.log('Compiled');

    const outputString = templates.htmlDocumentTemplate({ content: sanitizedHtml });

    fs.writeFileSync(path.join(outputPath, path.format({ name: path.parse(inputFile).name, ext: '.html' })), 
        outputString);

    console.log('Wrote file');
}

console.log('Rendering styles');
const sassResult = sass.renderSync({
    file: path.join(staticPath, 'sass', 'styles.scss'),
    includePaths: ['node_modules'],
    outFile: path.join(outputPath, 'stylesheets', 'styles.css')
});

fs.writeFileSync(path.join(outputPath, 'stylesheets', 'styles.css'), sassResult.css);

const inputFontFiles = fs.readdirSync(path.join(staticPath, 'fonts')).filter((fileName) => path.extname(fileName) === '.ttf');

for (inputFile of inputFontFiles) {
    console.log('Moving: ' + inputFile);
    const fileString = fs.readFileSync(path.join(staticPath, 'fonts', inputFile), 'utf8')

    fs.writeFileSync(path.join(outputPath, 'fonts', inputFile), fileString);

    console.log('Wrote file');
}

console.log('Wrote fonts');