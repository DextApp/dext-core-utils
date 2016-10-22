import search from '../../src/utils/search';

jest.mock('https');

describe('search', () => {
  it('should seach for packages', async () => {
    const mockHttpResponse = {
      results: [
        {
          name: ['foobar-default-theme'],
          description: ['Foobar default theme'],
        },
        {
          name: ['foobar-default-plugin'],
          description: ['Foobar default plugin'],
        },
      ],
    };
    require('https').__setMockResponse(JSON.stringify(mockHttpResponse));

    const q = 'foobar';
    const mockResponse = [
      {
        name: 'foobar-default-theme',
        desc: 'Foobar default theme',
      },
      {
        name: 'foobar-default-plugin',
        desc: 'Foobar default plugin',
      },
    ];
    expect(await search.searchPackages(q)).toEqual(mockResponse);
  });

  it('should retrieve the package url', () => {
    const pkg = 'foobar';
    expect(search.getSearchUrl(pkg)).toEqual('https://npmsearch.com/query?q=foobar%20AND%20(keywords:dext-theme%20OR%20keywords:dext-plugin)&fields=name,description');
  });
});
