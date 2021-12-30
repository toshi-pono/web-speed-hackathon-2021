import _ from 'lodash';
import { convertSound } from './convert_sound.js';
import { OfflineAudioContext } from 'web-audio-engine';

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate_wave(data) {
  const wavBuffer = (
    await convertSound(data, {
      extension: 'wav',
    })
  ).buffer;
  const audioCtx = new OfflineAudioContext(2, wavBuffer.byteLength, 44100);

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await audioCtx.decodeAudioData(wavBuffer.slice(0));

  // 左の音声データの絶対値を取る
  const leftData = _.map(buffer.getChannelData(0), Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = _.map(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  const normalized = _.map(_.zip(leftData, rightData), _.mean);
  // 100 個の chunk に分ける
  const chunks = _.chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const mean = _.map(chunks, _.mean);
  // NaNが入っているので除去（なぜ？）TODO: 原因究明
  const peaks = _.map(mean, (v) => (Number.isNaN(v) ? 0 : v));
  // chunk の平均の中から最大値を取る
  const max = _.max(peaks);

  return { max, peaks };
}

export { calculate_wave };
