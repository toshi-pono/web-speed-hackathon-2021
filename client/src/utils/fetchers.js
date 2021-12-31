/**
 * @template T
 * @param {string} url
 * @param {object} query
 * @returns {Promise<T>}
 */
async function fetchJSON(url, query = {}) {
  const query_params = new URLSearchParams(query);
  const res = await fetch(url + '?' + query_params.toString());
  return res.ok ? res.json() : Promise.reject();
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });
  return res.ok ? res.json() : Promise.reject();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.ok ? res.json() : Promise.reject();
}

export { fetchJSON, sendFile, sendJSON };
