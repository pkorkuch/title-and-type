
const fs = require('fs');
const path = require('path');

const md = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const { Readable } = require('stream');
const readline = require('readline');

const inputPath = path.resolve(path.join(__dirname, '../content'));
const outputPath = path.resolve(path.join(__dirname, '../build'));

console.log('Input path: ' + inputPath);
console.log('Output path: ' + outputPath);

if (!fs.existsSync(inputPath)) {
    process.exit(1);
}

const inputFiles = fs.readdirSync(inputPath).filter((fileName) => path.extname(fileName) === '.md');

console.log('Found: ' + inputFiles);

fs.rmdirSync(outputPath, { recursive: true });
fs.mkdirSync(outputPath);

for (inputFile of inputFiles) {
    console.log('Compiling: ' + inputFile);
    const fileString = fs.readFileSync(path.join(inputPath, inputFile), 'utf8');

    const rl = readline.createInterface({
        input: Readable.from(fileString),
        crlfDelay: Infinity
    });

    let num = 1;

    rl.on('line', (line) => {
        console.log(`Line ${num++} from file: ${line}`);
    });

    const renderedHtml = md(fileString);
    const sanitizedHtml = purify.sanitize(renderedHtml);

    console.log('Compiled');

    fs.writeFileSync(path.join(outputPath, path.format({ name: path.parse(inputFile).name, ext: '.html' })), 
        sanitizedHtml);

    console.log('Wrote file');
}