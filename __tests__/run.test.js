const core = require('@actions/core');

const { readBuildInfoFiles } = require('../src/buildinfo.js');
const { run } = require('../src/run.js');
const { searchBuildinfo } = require('../src/search.js');
const { uploadArtifact, uploadBuildInfo } = require('../src/upload.js');

// Mock dependencies
jest.mock('@actions/core', () => ({
  warning: jest.fn(),
  error: jest.fn(),
  setFailed: jest.fn(),
}));

jest.mock('../src/buildinfo.js', () => ({
    readBuildInfoFiles: jest.fn(),
}));
jest.mock('../src/search.js', () => ({
    searchBuildinfo: jest.fn(),
}));
jest.mock('../src/upload.js', () => ({
    uploadArtifact: jest.fn(),
    uploadBuildInfo: jest.fn(),
}));

describe('test run', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uploads artifacts', async () => {
    // Setup for success scenario
    searchBuildinfo.mockReturnValue(['path/to/buildinfo1', 'path/to/buildinfo2']);
    readBuildInfoFiles.mockReturnValue(['artifact1', 'artifact2']);

    run();

    expect(searchBuildinfo).toHaveBeenCalled();
    expect(readBuildInfoFiles).toHaveBeenCalledWith(['path/to/buildinfo1', 'path/to/buildinfo2']);
    expect(uploadBuildInfo).toHaveBeenCalledWith(['path/to/buildinfo1', 'path/to/buildinfo2']);
    expect(uploadArtifact).toHaveBeenCalledTimes(2); // Assuming two artifacts are found and uploaded
  });

  test('no build info files are found', async () => {
    // Setup for no build info files scenario
    searchBuildinfo.mockReturnValue([]);
    readBuildInfoFiles.mockReturnValue(null); // Assuming readBuildInfoFiles returns null when no files found

    run();

    expect(searchBuildinfo).toHaveBeenCalled();
    expect(readBuildInfoFiles).toHaveBeenCalledWith([]);
    expect(core.warning).toHaveBeenCalledWith('No output file found for upload.');
    expect(uploadBuildInfo).toHaveBeenCalledWith([]);
    expect(uploadArtifact).not.toHaveBeenCalled();
  });

  test('handles errors gracefully', async () => {
    // Setup for error scenario
    const error = new Error('Test error');
    searchBuildinfo.mockImplementation(() => {
      throw error;
    });

    run();

    expect(core.error).toHaveBeenCalledWith(error);
    expect(core.setFailed).toHaveBeenCalledWith(error.message);
  });
});
