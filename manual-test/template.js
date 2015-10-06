module.exports = function(data) {
  return [
    "// " + data.filePath,
    "// " + data.noExtensionFilePath,
    "// " + data.omittedFilePath,
    "// " + data.noExtensionOmittedFilePath,
    "// " + data.fileName,
    "// " + data.noExtensionFileName,
    "describe('Pending!');"
  ].join('\n');
};
