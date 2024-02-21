const core = require('@actions/core');
const { readBuildInfoFiles } = require('./buildinfo.js');
const { searchBuildinfo } = require('./search.js');
const { uploadArtifact } = require('./upload.js');

function run() {
    try {
        const buildInfoPaths = searchBuildinfo();

        let outputs = readBuildInfoFiles(buildInfoPaths);

        if (outputs) {
            outputs.forEach(output => {
                uploadArtifact(output);
            });
        } else {
            core.warning('No output file found for upload.');
        }

    } catch(error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

module.exports = {
    run,
};
