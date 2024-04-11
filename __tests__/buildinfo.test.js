const buildinfo = require('../src/buildinfo.js');
const inputs = require('../src/inputs.js');

const testBuildInfo = `# https://reproducible-builds.org/docs/jvm/
buildinfo.version=1.0-SNAPSHOT

name=Dummy Project Module
group-id=org.sentrysoftware
artifact-id=dummy-module
version=1.0.00

# source information
source.scm.uri=scm:git:https://github.com/sentrysoftware/xxx.git
source.scm.tag=v1.0.00

# build instructions
build-tool=mvn

# build environment information (simplified for reproducibility)
java.version=17
os.name=Unix

# Maven rebuild instructions and effective environment

# output

outputs.0.groupId=org.sentrysoftware
outputs.0.filename=dummy-module-1.0.00.pom
outputs.0.length=287
outputs.0.checksums.sha512=cbd2e4dc6ddd5590ecf4d7aec5a5a368121e21494611c6b8081461d669e0c9c8e40356bcbdf9f9ce9f4eabe5be0af2f4e93af3301db120e5fa5f7ad9b3ab700f

outputs.1.groupId=org.sentrysoftware
outputs.1.filename=dummy-module-1.0.00.txt
outputs.1.length=22
outputs.1.checksums.sha512=7b69215e1fc256d55f7a4cbb7daf5ca0cf63358a3d2bf85bb12f954646502afaef074f1d517184cf4e42271f4965f651850c76c1b6c90ff79f09a778e8c93a3d`;

jest.mock('fs', () => ({
    promises: {
        access: jest.fn()
    },
    readFileSync: jest.fn().mockReturnValue(testBuildInfo),
}));

jest.mock('path', () => ({
    dirname: jest.fn().mockReturnValue('/path/to'),
    join: jest.fn().mockImplementation((folder, name) => folder + '/' + name),
}));

describe('test readBuildInfoFiles', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('parse buildinfo', () => {

        const readBuildInfoFilesMock = jest.spyOn(buildinfo, 'readBuildInfoFiles');

        // Mock other modules
        jest.spyOn(inputs, 'getFileEncoding').mockImplementation(() => {
            return 'utf-8';
        });
        
        const outputs = buildinfo.readBuildInfoFiles(['/path/to/buildinfo1']);

        expect(readBuildInfoFilesMock).toHaveBeenCalled();

        expect(outputs).toStrictEqual([
            '/path/to/dummy-module-1.0.00.txt'
        ]);

    });

});
