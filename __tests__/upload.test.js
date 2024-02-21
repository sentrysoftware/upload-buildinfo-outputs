const artifact = require('@actions/artifact');
const core = require('@actions/core');
const github = require('@actions/github');

const { uploadArtifact } = require('../src/upload.js');
const inputs = require('../src/inputs.js');

jest.mock('path', () => ({
    basename: jest.fn().mockImplementation((name) => {
        const elements = name.split('/');
        return elements[elements.length - 1];
    }),
    dirname: jest.fn().mockReturnValue('/path/to'),
    resolve: jest.fn().mockImplementation((location) => location),
}));

jest.mock('@actions/core');
jest.mock('@actions/artifact');
jest.mock('@actions/github');

describe('test uploadArtifact', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    github.context.repo = { owner: 'ownerName', repo: 'repoName' };
    github.context.serverUrl = 'https://github.com';
    github.context.runId = '123456';
  });

  test('upload success', () => {

    // Mock other modules
    jest.spyOn(inputs, 'getUploadOptions').mockImplementation(() => {});

    // Setup default mocks for artifact client and GitHub context
    const mockUploadArtifact = jest.fn().mockResolvedValue({
        size: 100,
        id: 'artifact123'
    });
    artifact.DefaultArtifactClient.mockReturnValue({
        uploadArtifact: mockUploadArtifact
    });

    const fileName = 'some/path/artifact.zip';

    uploadArtifact(fileName);

    expect(artifact.DefaultArtifactClient).toHaveBeenCalled();
  });

  test('upload error', () => {
    
    // Mock other modules
    jest.spyOn(inputs, 'getUploadOptions').mockImplementation(() => {});

    const errorMessage = 'Upload failed';

    const mockUploadArtifact = jest.fn().mockRejectedValue(new Error(errorMessage));
    artifact.DefaultArtifactClient.mockReturnValue({
        uploadArtifact: mockUploadArtifact
    });

    uploadArtifact('some/path/artifact.zip');

    expect(artifact.DefaultArtifactClient).toHaveBeenCalled();
  });

});
