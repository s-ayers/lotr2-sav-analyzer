import YAML from 'yaml';
import fs from 'fs';

const file = fs.readFileSync('./sav.yaml', 'utf8');
const js = YAML.parse(file);

console.log(js.file);
