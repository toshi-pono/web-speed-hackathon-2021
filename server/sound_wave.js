import fs from 'fs/promises';
import path from 'path';
import { PUBLIC_PATH } from './src/paths.js';
import { calculate_wave } from './src/converters/generate_sound_wave.js';

const dir = path.resolve(PUBLIC_PATH, './sounds');

const files = await fs.readdir(dir);

for (const file of files) {
  if (path.extname(file) !== '.mp3') continue;

  const fileName = `${file}.json`;
  const buffer = await fs.readFile(path.resolve(dir, file));

  const { max, peaks } = await calculate_wave(buffer);
  const data = JSON.stringify({ max, peaks });
  await fs.writeFile(path.resolve(dir, fileName), data, 'utf8');

  console.log(`${fileName} is generated.`);
}
