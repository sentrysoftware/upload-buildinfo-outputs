const inputs = {
    SearchPath: 'search-path',
    FileEncoding: 'file-encoding',
    RetentionDays: 'retention-days',
    CompressionLevel: 'compression-level',
    Overwrite: 'overwrite',
};

const defaults = {
    SearchPath: '**/*.buildinfo',
    FileEncoding: 'utf-8',
};

module.exports = {
    inputs,
    defaults,
};
