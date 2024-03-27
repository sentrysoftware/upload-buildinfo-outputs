const path = require('path');
const core = require('@actions/core');
const artifact = require('@actions/artifact');
const github = require('@actions/github');

const { getUploadOptions } = require('./inputs.js');

function findCommonDirectory(paths) {
    // Split each path into parts
    const pathParts = paths.map(path => path.split(/\/|\\/));
    const shortestPathLength = Math.min(...pathParts.map(parts => parts.length));

    let commonParts = [];
    if (pathParts.length > 0) {
        for (let i = 0; i < shortestPathLength; i++) {
            let currentPart = pathParts[0][i];

            // Check if the current part is common to all paths
            if (pathParts.every(parts => parts[i] === currentPart)) {
                commonParts.push(currentPart);
            } else {
                // If a non-matching part is found, stop the search
                break;
            }
        }
    }

    const commonPath = commonParts.join("/");
    return commonPath;
}

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

function uploadBuildInfo(buildInfoPaths) {

    core.info(`uploadBuildInfo(${buildInfoPaths})`);

    const rootDirectory = findCommonDirectory(buildInfoPaths);

    const options = getUploadOptions();

    const client = new artifact.DefaultArtifactClient();
    const uploadPromise = client.uploadArtifact(
        'buildinfo.zip',
        buildInfoPaths,
        rootDirectory,
        options
    );

    core.info('Started artifact buildinfo.zip upload');

    uploadPromise.then(uploadResponse => {
        core.info(
            `Artifact buildinfo.zip has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
        );

        const repository = github.context.repo;
        const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`;
        core.info(`Artifact download URL: ${artifactURL}`);

    }).catch(err => {
        core.error(err);
    });

}

module.exports = {
    findCommonDirectory,
    uploadArtifact,
    uploadBuildInfo,
};
