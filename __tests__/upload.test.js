const artifact = require('@actions/artifact');
const core = require('@actions/core');
const github = require('@actions/github');

const { findCommonDirectory, uploadArtifact, uploadBuildInfo } = require('../src/upload.js');
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

describe('test findCommonDirectory', () => {

  test('common base directory', () => {
    const paths = [
      "/home/user/project/src/index.js",
      "/home/user/project/src/app/app.js",
      "/home/user/project/src/app/components/button.js"
    ];
    expect(findCommonDirectory(paths)).toBe("/home/user/project/src");
  });

  test('no common directory', () => {
    const paths = [
      "/home/user/project/src/index.js",
      "/root/docs/readme.md"
    ];
    expect(findCommonDirectory(paths)).toBe("");
  });

  test('mixed separators', () => {
    const paths = [
      "/home/user/project/file1.txt",
      "\\home\\user\\project\\file2.txt"
    ];
    expect(findCommonDirectory(paths)).toBe("/home/user/project");
  });

  test('single path', () => {
    const paths = ["/home/user/project/src/index.js"];
    expect(findCommonDirectory(paths)).toBe("/home/user/project/src/index.js");
  });

  test('empty array', () => {
    const paths = [];
    expect(findCommonDirectory(paths)).toBe("");
  });

  test('root directory', () => {
    const paths = [
      "/",
      "/home",
    ];
    expect(findCommonDirectory(paths)).toBe("");
  });
});

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

describe('test uploadBuildInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    github.context.repo = { owner: 'ownerName', repo: 'repoName' };
    github.context.serverUrl = 'https://github.com';
    github.context.runId = '123456';
  });

  test('upload success', async () => {
    // Mock other modules
    global.findCommonDirectory = jest.fn().mockReturnValue('/path/to');
    global.getUploadOptions = jest.fn().mockReturnValue({});

    // Setup default mocks for artifact client and GitHub context
    const mockUploadArtifact = jest.fn().mockResolvedValue({
      size: 100,
      id: 'artifact123'
    });
    artifact.DefaultArtifactClient.mockReturnValue({
      uploadArtifact: mockUploadArtifact
    });

    uploadBuildInfo(['/path/to/file1', '/path/to/file2']);

    expect(mockUploadArtifact).toHaveBeenCalledWith(
      'buildinfo.zip',
      ['/path/to/file1', '/path/to/file2'],
      '/path/to',
      {}
    );

  });

  test('upload error', async () => {
    // Mock other modules
    global.findCommonDirectory = jest.fn().mockReturnValue('/path/to');
    global.getUploadOptions = jest.fn().mockReturnValue({});

    const errorMessage = 'Upload failed';

    const mockUploadArtifact = jest.fn().mockRejectedValue(new Error(errorMessage));
    artifact.DefaultArtifactClient.mockReturnValue({
        uploadArtifact: mockUploadArtifact
    });

    uploadBuildInfo(['/path/to/file1', '/path/to/file2']);

    expect(artifact.DefaultArtifactClient).toHaveBeenCalled();
  });

});