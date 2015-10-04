var assert = require('assert');

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
  });
});
