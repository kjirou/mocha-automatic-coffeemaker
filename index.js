#!/usr/bin/env node

var escapeStringRegExp = require('escape-string-regexp');
var fs = require('fs');
var minimist = require('minimist');
var mkdirp = require('mkdirp');
var path = require('path');
var defer = require("promise-defer");

var utils = require('./lib/utils');


module.exports = function generateTest(argv, callback) {

  var commandOptions = minimist(argv.slice(2), {
    default: {
      extensions: 'js,es,es6,es7,coffee,ts',
      force: false,
      omission: null,
      prefix: 'test',
      root: __dirname,
      template: path.join(__dirname, 'mocha-automatic-coffeemaker-template.js')
    },
    alias: {
      e: ['extensions'],
      f: ['force'],
      o: ['omission'],
      p: ['prefix'],
      r: ['root'],
      t: ['template']
    }
  });

  var outputs = [];

  //
  // resolve paths
  //
  var targetExtensions = utils.splitExtensionsString(commandOptions.extensions);
  var root = path.resolve(commandOptions.root);
  var targetFilePath = path.resolve(commandOptions._[0]);
  if (targetFilePath.indexOf(root) !== 0) {
    callback(new Error('The `' + root + '` is not included in `' + targetFilePath + '`'));
    return;
  }
  var relativeTargetFilePath = path.relative(root, targetFilePath);
  var omittedRelativeTargetFilePath = relativeTargetFilePath;
  if (typeof commandOptions.omission === 'string') {
    omittedRelativeTargetFilePath =
      relativeTargetFilePath.replace(
        new RegExp(escapeStringRegExp(commandOptions.omission) + '\\/*'),
        ''
      );
  }
  var relativeTestFilePath = path.join(commandOptions.prefix, omittedRelativeTargetFilePath);


  //
  // get test code template
  //
  var defaultTestCodeTemplate = function(data) {
    var filePath = data.filePath;
    var noExtensionFilePath = data.noExtensionFilePath;
    var fileName = data.fileName;
    var noExtensionFileName = data.noExtensionFileName;

    return [
      "describe('" + noExtensionFilePath + "', function() {",
      "});",
    ].join('\n');
  };
  var testCodeTemplateModuleId = utils.cutExtension(
    path.resolve(commandOptions.template),
    targetExtensions
  );
  var testCodeTemplate = utils.wantModule(testCodeTemplateModuleId) || defaultTestCodeTemplate;

  outputs.push('Generated successfully!');
  outputs.push('root: ' + root);
  outputs.push('src : ' + relativeTargetFilePath);
  outputs.push('test: ' + relativeTestFilePath);

  Promise.resolve()
    // does target file exist?
    .then(function() {
      var dfd = defer();
      fs.stat(targetFilePath, function(err) {
        if (err) {
          dfd.reject(err);
          return;
        }
        dfd.resolve();
      });
      return dfd.promise;
    })
    // does test code already exist?
    .then(function() {
      var dfd = defer();
      fs.stat(relativeTestFilePath, function(err) {
        if (!commandOptions.force && !err) {
          dfd.reject(new Error("`" + relativeTestFilePath + '` already exists'));
          return;
        }
        dfd.resolve();
      });
      return dfd.promise;
    })
    // execute `mkdir -p`
    .then(function() {
      var dfd = defer();
      mkdirp(path.dirname(relativeTestFilePath), 0755, function(err) {
        if (err) {
          dfd.reject(err);
          return;
        }
        dfd.resolve();
      });
      return dfd.promise;
    })
    // generate test code
    .then(function() {
      var testCode = testCodeTemplate({
        filePath: relativeTargetFilePath,
        noExtensionFilePath: utils.cutExtension(relativeTargetFilePath, targetExtensions),
        fileName: path.basename(targetFilePath),
        noExtensionFileName: utils.cutExtension(path.basename(targetFilePath), targetExtensions)
      });
      if (testCode.slice(-1) !== '\n') {
        testCode += '\n';
      }
      var dfd = defer();
      fs.writeFile(relativeTestFilePath, testCode, function(err) {
        if (err) {
          dfd.reject(err);
          return;
        }
        dfd.resolve();
      });
      return dfd.promise;
    })
    .then(function() {
      callback(null, outputs);
    })
    .catch(function(err) {
      callback(err);
    })
  ;
};
