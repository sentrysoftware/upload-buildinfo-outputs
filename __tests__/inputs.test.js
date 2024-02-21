const core = require('@actions/core');
const inputs = require('../src/inputs.js');
const { defaults } = require('../src/constants.js');

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();

describe('test search-path input', () => {

    // Mock the action's main function
    const searchPathMock = jest.spyOn(inputs, 'getSearchPath');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('empty search-path', () => {
        getInputMock.mockImplementation(name => {
            return '';
        });

        inputs.getSearchPath();
        expect(searchPathMock).toHaveReturnedWith(defaults.SearchPath);
    });

    it('custom search-path', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'search-path':
                    return 'custom-glob';
                default:
                    return '';
            }
        });

        inputs.getSearchPath();
        expect(searchPathMock).toHaveReturnedWith('custom-glob');
    });

});

describe('test file-encoding input', () => {

    // Mock the action's main function
    const fileEncodingMock = jest.spyOn(inputs, 'getFileEncoding');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('empty file-encoding', () => {
        getInputMock.mockImplementation(name => {
            return '';
        });

        inputs.getFileEncoding();
        expect(fileEncodingMock).toHaveReturnedWith(defaults.FileEncoding);
    });

    it('custom file-encoding', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'file-encoding':
                    return 'custom-encoding';
                default:
                    return '';
            }
        });

        inputs.getFileEncoding();
        expect(fileEncodingMock).toHaveReturnedWith('custom-encoding');
    });

});

describe('test upload options inputs', () => {

    // Mock the action's main function
    const uploadOptionsMock = jest.spyOn(inputs, 'getUploadOptions');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('empty options', () => {
        getInputMock.mockImplementation(name => {
            return '';
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({});
    });

    it('custom upload options compression-level', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                    return '5';
                case 'retention-days':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            compressionLevel: 5
        });
    });

    it('custom upload options compression-level NaN', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                    return 'a';
                case 'retention-days':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(setFailedMock).toHaveBeenNthCalledWith(
            1,
            'Invalid compression-level. a is not a valid number.'
        );
    });

    it('custom upload options compression-level negative', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                    return '-2';
                case 'retention-days':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(setFailedMock).toHaveBeenNthCalledWith(
            1,
            'Invalid compression-level. Valid values are 0-9.'
        );
    });

    it('custom upload options compression-level out of bounds', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                    return '10';
                case 'retention-days':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(setFailedMock).toHaveBeenNthCalledWith(
            1,
            'Invalid compression-level. Valid values are 0-9.'
        );
    });

    it('custom upload options retention-days', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'retention-days':
                    return '5';
                case 'compression-level':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            retentionDays: 5
        });
    });

    it('custom upload options retention-days NaN', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'retention-days':
                    return 'a';
                case 'compression-level':
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(setFailedMock).toHaveBeenNthCalledWith(
            1,
            'Invalid retention-days. a is not a valid number.'
        );
    });

    it('custom upload options overwrite true', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'overwrite':
                    return 'true';
                case 'compression-level':
                case 'retention-days':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            overwrite: true
        });
    });

    it('custom upload options overwrite false', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'overwrite':
                    return 'false';
                case 'compression-level':
                case 'retention-days':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            overwrite: false
        });
    });

    it('custom upload options overwrite other', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'overwrite':
                    return 'aaa';
                case 'compression-level':
                case 'retention-days':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            overwrite: false
        });
    });

    it('custom upload options all set', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                case 'retention-days':
                    return '5';
                case 'overwrite':
                    return 'true'
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        expect(uploadOptionsMock).toHaveReturnedWith({
            compressionLevel: 5,
            retentionDays: 5,
            overwrite: true
        });
    });

    it('custom upload options multiple errors', () => {
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'compression-level':
                case 'retention-days':
                    return 'a';
                case 'overwrite':
                default:
                    return '';
            }
        });

        inputs.getUploadOptions();
        inputs.getUploadOptions();
        expect(setFailedMock).toHaveBeenNthCalledWith(
            1,
            'Invalid compression-level. a is not a valid number.'
        );
        expect(setFailedMock).toHaveBeenNthCalledWith(
            2,
            'Invalid retention-days. a is not a valid number.'
        );
    });

});