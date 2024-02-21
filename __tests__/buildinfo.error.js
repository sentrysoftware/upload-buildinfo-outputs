const buildinfo = require('../src/buildinfo.js');
const inputs = require('../src/inputs.js');

jest.mock('fs', () => ({
    promises: {
        access: jest.fn()
    },
    readFileSync: jest.fn().mockRejectedValue(() => { throw new Error('Cannot read.'); }),
}));

jest.mock('path', () => ({
    dirname: jest.fn().mockReturnValue('/path/to'),
    join: jest.fn().mockImplementation((folder, name) => folder + '/' + name),
}));

describe('test readBuildInfoFiles', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('parse buildinfo', () => {

        const readBuildInfoFilesMock = jest.spyOn(buildinfo, 'readBuildInfoFiles');

        // Mock other modules
        jest.spyOn(inputs, 'getFileEncoding').mockImplementation(() => {
            return 'utf-8';
        });

        expect(buildinfo.readBuildInfoFiles(['/path/to/buildinfo1'])).rejects.toMatch('error');

    });

});
