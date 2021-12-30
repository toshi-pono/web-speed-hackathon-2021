import { promises as fs } from 'fs';
import path from 'path';

import Router from 'express-promise-router';
import httpErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

import { calculate_wave } from '../../converters/generate_sound_wave';
import { convertSound } from '../../converters/convert_sound';
import { UPLOAD_PATH } from '../../paths';
import { extractMetadataFromSound } from '../../utils/extract_metadata_from_sound';

// 変換した音声の拡張子
const EXTENSION = 'mp3';

const router = Router();

const convertFile = async (file, soundId) => {
  const converted = await convertSound(file, {
    // 音声の拡張子を指定する
    extension: EXTENSION,
  });

  const filePath = path.resolve(UPLOAD_PATH, `./sounds/${soundId}.${EXTENSION}`);
  await fs.writeFile(filePath, converted);
};

const generateMetaFile = async (file, soundId) => {
  const { max, peaks } = await calculate_wave(file);
  const metaFilePath = path.resolve(UPLOAD_PATH, `./sounds/${soundId}.${EXTENSION}.json`);
  const metaFile = JSON.stringify({ max, peaks });
  await fs.writeFile(metaFilePath, metaFile);
};

router.post('/sounds', async (req, res) => {
  if (req.session.userId === undefined) {
    throw new httpErrors.Unauthorized();
  }
  if (Buffer.isBuffer(req.body) === false) {
    throw new httpErrors.BadRequest();
  }

  const soundId = uuidv4();

  const { artist, title } = await extractMetadataFromSound(req.body);

  await Promise.all([convertFile(req.body, soundId), generateMetaFile(req.body, soundId)]);

  return res.status(200).type('application/json').send({ artist, id: soundId, title });
});

export { router as soundRouter };
