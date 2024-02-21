const path = require('path');
const core = require('@actions/core');
const artifact = require('@actions/artifact');
const github = require('@actions/github');

const { getUploadOptions } = require('./inputs.js');

function uploadArtifact(filePath) {

    core.info(`uploadArtifact(${filePath})`);

    const location = path.resolve(filePath);

    const fileName = path.basename(location);
    const rootDirectory = path.dirname(location);

    const filesToUpload = [
        location
    ];
    const options = getUploadOptions();

    core.info(`uploadArtifact(${filePath}) : root ${rootDirectory}, files ${JSON.stringify(filesToUpload)}, options ${JSON.stringify(options)}`);

    const client = new artifact.DefaultArtifactClient();
    const uploadPromise = client.uploadArtifact(
        fileName,
        filesToUpload,
        rootDirectory,
        options
    );

    core.info(`Started artifact ${fileName} upload`);

    uploadPromise.then(uploadResponse => {
        core.info(
            `Artifact ${fileName} has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
        );

        const repository = github.context.repo;
        const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`;
        core.info(`Artifact download URL: ${artifactURL}`);

    }).catch(err => {
        core.error(err);
    });

}

module.exports = {
    uploadArtifact,
};
