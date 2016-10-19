import search from '../../src/utils/search';

jest.mock('http');

describe('search', () => {
  it('should seach for packages', async () => {
    const mockHttpResponse = {results: [{"name":["foobar-default-theme"]},{"name":["foobar-default-plugin"]}]};
    require('http').__setMockResponse(JSON.stringify(mockHttpResponse));

    const pkg = 'foobar';
    const mockResponse = [{"name":["foobar-default-theme"]},{"name":["foobar-default-plugin"]}];
    expect(await search.searchPackages(pkg)).toEqual(mockResponse);
  });

  it('should retrieve the package url', () => {
    const pkg = 'foobar';
    expect(search.getSearchUrl(pkg)).toEqual('http://npmsearch.com/query\?q\=foobar%20AND%20\(keywords:dext-theme%20OR%20keywords:dext-plugin\)\&fields\=name');
  });
});
