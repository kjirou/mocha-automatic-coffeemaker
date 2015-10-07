var objectAssign = require('object-assign');
var path = require('path');


function createDefaultOptions(root) {
  var defaultOptions = {
    dirname: 'test',
    extensions: 'js,es,es6,es7,coffee,ts',
    force: false,
    omission: null,
    root: root,
    template: path.join(root, 'mocha-automatic-coffeemaker-template.js')
  };
  var projectPkg = require(path.join(root, 'package.json'));
  objectAssign(defaultOptions, projectPkg['mocha-automatic-coffeemaker'] || {});
  return defaultOptions;
}

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
  createDefaultOptions: createDefaultOptions,
  cutExtension: cutExtension,
  splitExtensionsString: splitExtensionsString,
  wantModule: wantModule
};
