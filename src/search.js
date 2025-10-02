const { globSync } = require('glob');
const core = require('@actions/core');
const { getSearchPath } = require('./inputs.js');

function searchBuildinfo() {
    const searchPath = getSearchPath();
    core.info(`Search for buildinfo file in ${searchPath}!`);
    return globSync(searchPath);
}

function searchFilePath(fileName) {
    const searchPath = `**/${fileName}`;
    core.info(`Search for file in ${searchPath}!`);
    const filePaths = globSync(searchPath);
    // Return the first found file path or null if not found
    return filePaths.length > 0 ? filePaths[0] : null;
}

module.exports = {
    searchBuildinfo,
    searchFilePath,
};
