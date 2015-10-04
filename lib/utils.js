function splitExtensionsString(extensionsString) {
  return extensionsString.split(',');
}

function cutExtension(fileName, extensions) {
  extensions.some(function(extension) {
    extension = '.' + extension;
    if (fileName.indexOf(extension) === (fileName.length - extension.length)) {
      fileName = fileName.slice(0, fileName.length - extension.length);
      return true;
    }
  });
  return fileName;
}

function wantModule(moduleId) {
  try {
    return require(moduleId);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw err;
  }
};

module.exports = {
  splitExtensionsString: splitExtensionsString,
  cutExtension: cutExtension,
  wantModule: wantModule
};
