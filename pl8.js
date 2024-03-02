import YAML from 'yaml';
import fs from 'fs';
import { Parser} from 'binary-parser';

const file_def = fs.readFileSync('./pl8.yml', 'utf8');
const def = YAML.parse(file_def);

console.log(def.file);
const tile = new Parser()
  .endianess("little")
  .uint16("width")
  .uint16("height")
  .uint32("offset")
  .uint16("x")
  .uint16("y")
  .uint8("extraType")
  .uint8("extraRows")
  .uint16("unknown_000");

const yml = new Parser().endianess("little");
for (const key in def.file.mapping) {
  const item = def.file.mapping[key];
  const type = item.type;

  switch (type) {
    case 'array':
      console.log('yes');
      if (item.array === 'tile') {
        yml.array(key, {
          type: tile,
          length: item.length
        });

      }
      break;

    default:
      yml[item.type](key);
      console.log(type);
      break;
  }
  // console.log(yml);
  // console.log(key);
  // console.log(def.pl8.mapping[key]);
}


const pl8 = new Parser()
  .useContextVars()
  .endianess("little")
  .uint16("type")
  .uint16("tile_count")
  .uint32("unknown_000");

const file_buffer = fs.readFileSync('./images/A2_horse.pl8');




const parsed = pl8.parse(file_buffer);

console.log(parsed);
console.log(yml.parse(file_buffer));