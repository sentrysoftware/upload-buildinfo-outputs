const core = require('@actions/core');
const search = require('../src/search.js');
const inputs = require('../src/inputs.js');

jest.mock('glob', () => ({
    globSync: jest.fn().mockReturnValue([
        'path/to/buildinfo1', 'path/to/buildinfo2'
    ]),
}));

// Mock the GitHub Actions core library
const coreInfoMock = jest.spyOn(core, 'info').mockImplementation();

describe('test searchBuildinfo', () => {

    // Mock the action's main function
    const searchBuildinfoMock = jest.spyOn(search, 'searchBuildinfo');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('empty default path', () => {

        // Mock other modules
        jest.spyOn(inputs, 'getSearchPath').mockImplementation(() => {
            return '**/*.buildinfo';
        });
        
        search.searchBuildinfo();

        expect(searchBuildinfoMock).toHaveReturnedWith([
            'path/to/buildinfo1', 'path/to/buildinfo2'
        ]);

        expect(coreInfoMock).toHaveBeenNthCalledWith(
            1,
            'Search for buildinfo file in **/*.buildinfo!'
        );
    });

});
