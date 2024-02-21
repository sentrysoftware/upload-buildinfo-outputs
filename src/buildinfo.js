const { readFileSync } = require('fs');
const { dirname, join } = require('path');
const { debug, error } = require('@actions/core');

const { getFileEncoding } = require('./inputs.js');

function readBuildInfoFile(filePath) {
    const outputs = [];
    try {

        debug(`readBuildInfo(${filePath})`);

        const encoding = getFileEncoding();

        const location = dirname(filePath);
        const content = readFileSync(filePath, encoding);
        const lines = content.split(/\n|\r\n/);

        debug(`readBuildInfo(${filePath}) : file has ${lines.length} lines`);

        lines.forEach(line => {
            if (line.startsWith('outputs') && line.includes('filename=')) {
                const outputFileName = line.split('=')[1];
                const outputFilePath = join(location, outputFileName);
                outputs.push(outputFilePath);
            }
        });

        return outputs;

    } catch (err) {
        error(err);
        throw new Error(`Cannot read buildinfo file ${filePath}`, { cause: err });

    } finally {
        debug(`readBuildInfo(${filePath}) : output [${outputs.length}] ${JSON.stringify(outputs)}`);
    }
}

function readBuildInfoFiles(filePathArray) {
    let outputs = [];
    if (filePathArray) {
        filePathArray.forEach(file => {
            outputs = outputs.concat(readBuildInfoFile(file));
        });
    }
    return outputs;
}

module.exports = {
    readBuildInfoFiles,
};
