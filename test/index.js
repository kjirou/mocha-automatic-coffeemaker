var assert = require('assert');
var path = require('path');

var utils = require('../lib/utils.js');


describe('mocha-automatic-coffeemaker', function() {

  context('utils', function() {

    it('splitExtensionsString', function() {
      assert.deepEqual(utils.splitExtensionsString('js,coffee,ts'), ['js', 'coffee', 'ts']);
    });

    it('cutExtension', function() {
      assert.strictEqual(utils.cutExtension('foo.js', ['js']), 'foo');
      assert.strictEqual(utils.cutExtension('foo.coffee', ['js']), 'foo.coffee');
      assert.strictEqual(utils.cutExtension('foo.coffee', ['js', 'coffee']), 'foo');
      assert.strictEqual(utils.cutExtension('foo.js.coffee', ['js', 'coffee']), 'foo.js');
    });

    it('createDefaultOptions', function() {
      var root;

      root = path.join(__dirname, 'support/no-settings-packagejson');
      assert.deepEqual(utils.createDefaultOptions(root), {
        dirname: 'test',
        extensions: 'js,es,es6,es7,coffee,ts',
        force: false,
        omission: null,
        root: root,
        template: path.join(root, 'mocha-automatic-coffeemaker-template.js')
      });

      root = path.join(__dirname, 'support');
      assert.deepEqual(utils.createDefaultOptions(root), {
        dirname: 'spec',
        extensions: 'js,es,es6,es7,coffee,ts',
        force: true,
        omission: 'src',
        root: root,
        template: path.join(root, 'mocha-automatic-coffeemaker-template.js')
      });
    });
  });
});
