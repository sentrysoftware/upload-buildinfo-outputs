const core = require('@actions/core');

const { inputs, defaults } = require('./constants.js');

function getSearchPath() {
    const searchPath = core.getInput(inputs.SearchPath);
    if (searchPath) {
        return searchPath;
    }
    return defaults.SearchPath;
}

function getFileEncoding() {
    const fileEncoding = core.getInput(inputs.FileEncoding);
    if (fileEncoding) {
        return fileEncoding;
    }
    return defaults.FileEncoding;
}

function getUploadOptions() {

    const compressionLevelStr = core.getInput(inputs.CompressionLevel);
    const retentionDaysStr = core.getInput(inputs.RetentionDays);
    const overwriteStr = core.getInput(inputs.Overwrite);

    const options = {};

    if (compressionLevelStr) {
        options.compressionLevel = parseInt(compressionLevelStr);
        if (isNaN(options.compressionLevel)) {
            core.setFailed(`Invalid ${inputs.CompressionLevel}. ${compressionLevelStr} is not a valid number.`);
        }
        if (options.compressionLevel < 0 || options.compressionLevel > 9) {
            core.setFailed(`Invalid ${inputs.CompressionLevel}. Valid values are 0-9.`);
        }
    }

    if (retentionDaysStr) {
        options.retentionDays = parseInt(retentionDaysStr);
        if (isNaN(options.retentionDays)) {
            core.setFailed(`Invalid ${inputs.RetentionDays}. ${retentionDaysStr} is not a valid number.`);
        }
    }

    if (overwriteStr) {
        options.overwrite = ('true' == overwriteStr.toLowerCase())
    }

    return options;
}

module.exports = {
    getSearchPath,
    getFileEncoding,
    getUploadOptions,
};
