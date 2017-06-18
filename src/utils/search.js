const https = require('https');

/**
 * Retrieves the API url
 *
 * @param {String} q - The keyword to search
 * @return {String}
 */
const getSearchUrl = q =>
    `https://npmsearch.com/query?q=${q}%20AND%20(keywords:dext-theme%20OR%20keywords:dext-plugin)&fields=name,description`;

/**
 * Searches for packages marked with the keywords 'dext-plugin' or 'dext-theme'
 *
 * { name, desc }
 *
 * @param {String} q - A keyword to search for (queried by package name)
 * @return {Promise} - Resolves an array of the package names and descriptions
 */
const searchPackages = q =>
    new Promise(resolve => {
        let body = '';
        const endpoint = getSearchUrl(q);
        // Retrieve the search results
        return https.get(endpoint, res => {
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                const results = JSON.parse(body);
                if (!results.results) {
                    resolve([]);
                    return;
                }
                const resultsFlat = results.results.map(c => ({
                    name: c.name[0],
                    desc: c.description ? c.description[0] : '',
                }));
                // Return the results part of the HTTP response
                resolve(resultsFlat);
            });
        });
    });

module.exports = {
    getSearchUrl,
    searchPackages,
};
