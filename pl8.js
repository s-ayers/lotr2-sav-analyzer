import fs from 'fs';
import {Parser} from 'binary-parser';
import {PNG} from "pngjs";

const ORTHOGONAL = 0;
const RUN_LENGTH_ENCODED = 1;

/**
 * Writes all the sprites to a single image.
 */
function write_image(parsed) {
  const width = 640;
  const pixal_size = 4;
  const options = { width: width, height: 480 };
  const image = new PNG(options);

  for (const tile of parsed.sprites) {
    for (let y = 0; y < tile.height; y+=1) {
      const target_start = (width * pixal_size) * (tile.y + y) + (tile.x * pixal_size);
      const source_start = y * tile.width * pixal_size;
      const source_end = (y + 1) * tile.width * pixal_size;
      tile.image.data.copy(image.data, target_start, source_start, source_end);
    }
  }

  return image;
}

/**
 * Convert an orthogonal sprite to an image buffer.
 */
function orthogonal(sprite, pl8_buffer, palette_buffer) {
  const offset = sprite.offset;
  const length = sprite.width * sprite.height;

  const buffer = pl8_buffer.subarray(offset, offset + length);

  const options = { width: sprite.width, height: sprite.height };
  const image = new PNG(options);
  for (let h = 0; h < sprite.height; h+=1) {
    for (let w = 0; w < sprite.width; w+=1) {
      const buffer_index = (h * sprite.width + w);
      const color = buffer.readUInt8(buffer_index);
      const image_index = buffer_index * 4;

      if (color === 0) {
        image.data[image_index] = 0x00;
        image.data[image_index + 1] = 0x00;
        image.data[image_index + 2] = 0x00;
        image.data[image_index + 3] = 0x00;
        continue;
      }

      image.data[image_index] = palette_buffer.readUInt8(color * 3) * 4;
      image.data[image_index + 1] = palette_buffer.readUInt8(color * 3 + 1) * 4;
      image.data[image_index + 2] = palette_buffer.readUInt8(color * 3 + 2) * 4;
      image.data[image_index + 3] = 0xff;
    }
  }


  return image;
}

function run_length_encoded() {

}

const sprite = new Parser().endianess('little')
  .uint16('width')
  .uint16('height')
  .uint32('offset')
  .uint16('x')
  .uint16('y')
  .uint8('extra_type')
  .uint8('extra_rows')
  .uint16('unknown');

const pl8 = new Parser().endianess('little')
  .uint16('type')
  .uint16('count')
  .int8('unknown_000')
  .int8('unknown_001')
  .int8('unknown_002')
  .int8('unknown_003')
  .array('sprites', {
    type: sprite,
    length: 'count'
  });


const pl8_buffer = fs.readFileSync('./images/Arm_swor.pl8');
const palette_buffer = fs.readFileSync('./images/Armoury.256');

const parsed = pl8.parse(pl8_buffer);

const pad = (parsed.count + '').length;
const type = parsed.type;

let i = 0;
for (const tile of parsed.sprites) {
  switch (type) {
    case ORTHOGONAL:
      tile.image = orthogonal(tile, pl8_buffer, palette_buffer);
      const counter = i.toString().padStart(pad, '0');
      tile.image.pack().pipe(fs.createWriteStream(`sprites/Arm_swor/Arm_swor_${counter}.png`));
      break;

    case RUN_LENGTH_ENCODED:
      break;

    default:
      throw new Error(`Unknown type: ${type}`);
  }

  i += 1;
}

write_image(parsed).pack().pipe(fs.createWriteStream(`sprites/Arm_swor.png`));
