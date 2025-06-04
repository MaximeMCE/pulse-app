import fs from 'fs';
import path from 'path';

const dir = path.resolve('output');
const files = fs.readdirSync(dir).filter(f => f.endsWith('_seed.json'));

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
  const count = Array.isArray(content) ? content.length : 0;
  console.log(`${file.replace('_seed.json', '')}: ${count} artists`);
}
