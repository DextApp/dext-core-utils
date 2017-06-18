// Mocks the module "download"

const download = (downloadUrl, outputDir) =>
    new Promise(resolve => {
        process.nextTick(resolve(outputDir));
    });

module.exports = download;
