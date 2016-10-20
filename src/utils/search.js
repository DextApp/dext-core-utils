const http = require('http');

const getSearchUrl = pkg => `http://npmsearch.com/query?q=${pkg}%20AND%20(keywords:dext-theme%20OR%20keywords:dext-plugin)&fields=name`;

/**
 * Searches for package marked with the keywords 'dext-plugin' or 'dext-theme'
 *
 * @param {String} pkg - The name of the npm package
 * @return {Promise} - The search results
 */
const searchPackages = pkg => new Promise((resolve) => {
  let body = '';
  // Retrieve the search results
  return http.get(getSearchUrl(pkg), (res) => {
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      const results = JSON.parse(body);
      // Return the results part of the HTTP response
      resolve(results.results);
    });
  });
});

module.exports = {
  getSearchUrl,
  searchPackages,
};
