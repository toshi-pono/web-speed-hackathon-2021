import React from 'react';

import { useFetch } from '../../../hooks/use_fetch';
import { fetchBinary } from '../../../utils/fetchers';

/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} src
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, src }) => {
  const { data, isLoading } = useFetch(src, fetchBinary);

  const blobUrl = React.useMemo(() => {
    return data !== null ? URL.createObjectURL(new Blob([data])) : null;
  }, [data]);

  if (isLoading || data === null || blobUrl === null) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <img
        alt={alt}
        className="object-cover w-full h-full"
        src={blobUrl}
      />
    </div>
  );
};

export { CoveredImage };
