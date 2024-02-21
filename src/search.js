const { globSync } = require('glob');
const core = require('@actions/core');
const { getSearchPath } = require('./inputs.js');

function searchBuildinfo() {
    const searchPath = getSearchPath();
    core.info(`Search for buildinfo file in ${searchPath}!`);
    return globSync(searchPath);
}

module.exports = {
    searchBuildinfo,
};
