# mocha-automatic-coffeemaker

[![npm version](https://badge.fury.io/js/mocha-automatic-coffeemaker.svg)](http://badge.fury.io/js/mocha-automatic-coffeemaker)
[![Build Status](https://travis-ci.org/kjirou/mocha-automatic-coffeemaker.svg?branch=master)](https://travis-ci.org/kjirou/mocha-automatic-coffeemaker)

Generate a test code of [mocha](https://www.npmjs.com/package/mocha) by the same path structure


## Installation

```bash
npm install -g mocha-automatic-coffeemaker
```


## Example

There is a targeted file of testing:

```bash
$ tree ./lib
lib
└── util.js
```

Generate a mocha's test code:

```bash
$ genmochatest lib/utils.js
Generated successfully!
root: /home/username/your-project
src : lib/utils.js
test: test/lib/utils.js
$ cat test/lib/utils.js
describe('lib/utils', function() {
});
```


## Usage

```
$ genmochatest [options] <target-file-path>


<target-file-path>

  A file path of the code that you want to write a test

  e.g.
    lib/foo.js
    /path/to/lib/x/y/foo.js


[options]

  --dirname, -d
    Default: 'test'

  --extensions, -e
    Default: 'js,es,es6,es7,coffee,ts,jsx'

  --force, -f
    Default: false
    Overwrite a test code, even if it already exists

  --omission, -o
    Default: null
    Excluded from the path in front match at the time of test generation

  --root, -r
    Default: process.cwd()

  --template, -t
    Default: process.cwd() + '/mocha-automatic-coffeemaker-template.js'
```

Default options can also be defined in the package.json:

```
"mocha-automatic-coffeemaker": {
  "dirname": "spec",
  "force": true
},
```


## Template Example

You can specify the template of test code like the following code:

```js
module.exports = function(data) {

  // e.g. "foo/bar/baz.js"
  var filePath = data.filePath;
  // e.g. "foo/bar/baz"
  var noExtensionFilePath = data.noExtensionFilePath;
  // e.g. "baz.js"
  var fileName = data.fileName;
  // e.g. "baz"
  var noExtensionFileName = data.noExtensionFileName;

  // e.g. If you specified `--omission bar`, then it assigned "foo/baz.js"
  var omittedFilePath = data.omittedFilePath;
  var noExtensionOmittedFilePath = data.noExtensionOmittedFilePath;

  return [
    "describe('" + noExtensionFilePath + "', function() {",
    "});",
  ].join('\n');
};
```
