'use strict';

const helper = require('../helper');
const fs = require('fs');
const mock = require('../../lib/index');
const path = require('path');

const assert = helper.assert;
const withPromise = helper.withPromise;

describe('fs.readdir(path, callback)', function() {
  beforeEach(function() {
    mock({
      'path/to/file.txt': 'file content',
      nested: {
        sub: {
          dir: {
            'one.txt': 'one content',
            'two.txt': 'two content',
            empty: {}
          }
        }
      }
    });
  });
  afterEach(mock.restore);

  it('lists directory contents', function(done) {
    fs.readdir(path.join('path', 'to'), function(err, items) {
      assert.isNull(err);
      assert.isArray(items);
      assert.deepEqual(items, ['file.txt']);
      done();
    });
  });

  withPromise.it('promise lists directory contents', function(done) {
    fs.promises.readdir(path.join('path', 'to')).then(function(items) {
      assert.isArray(items);
      assert.deepEqual(items, ['file.txt']);
      done();
    }, done);
  });

  it('lists nested directory contents', function(done) {
    fs.readdir(path.join('nested', 'sub', 'dir'), function(err, items) {
      assert.isNull(err);
      assert.isArray(items);
      assert.deepEqual(items, ['empty', 'one.txt', 'two.txt']);
      done();
    });
  });

  withPromise.it('promise lists nested directory contents', function(done) {
    fs.promises
      .readdir(path.join('nested', 'sub', 'dir'))
      .then(function(items) {
        assert.isArray(items);
        assert.deepEqual(items, ['empty', 'one.txt', 'two.txt']);
        done();
      }, done);
  });

  it('calls with an error for bogus path', function(done) {
    fs.readdir('bogus', function(err, items) {
      assert.instanceOf(err, Error);
      assert.isUndefined(items);
      done();
    });
  });

  withPromise.it('promise calls with an error for bogus path', function(done) {
    fs.promises.readdir('bogus').then(
      function() {
        assert.fail('should not succeed.');
        done();
      },
      function(err) {
        assert.instanceOf(err, Error);
        done();
      }
    );
  });
});

describe('fs.readdirSync(path)', function() {
  beforeEach(function() {
    mock({
      'path/to/file.txt': 'file content',
      nested: {
        sub: {
          dir: {
            'one.txt': 'one content',
            'two.txt': 'two content',
            empty: {}
          }
        }
      }
    });
  });
  afterEach(mock.restore);

  it('lists directory contents', function() {
    const items = fs.readdirSync(path.join('path', 'to'));
    assert.isArray(items);
    assert.deepEqual(items, ['file.txt']);
  });

  it('lists nested directory contents', function() {
    const items = fs.readdirSync(path.join('nested', 'sub', 'dir'));
    assert.isArray(items);
    assert.deepEqual(items, ['empty', 'one.txt', 'two.txt']);
  });

  it('throws for bogus path', function() {
    assert.throws(function() {
      fs.readdirSync('bogus');
    });
  });
});
