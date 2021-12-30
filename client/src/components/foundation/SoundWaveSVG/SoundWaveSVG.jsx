import React from 'react';

/**
 * @typedef {object} Props
 * @property {number} max
 * @property {number[]} peaks
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ max, peaks }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
