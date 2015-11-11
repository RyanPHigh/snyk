
var yaml = require('js-yaml');
var fs = require('then-fs');
var path = require('path');
var Promise = require('es6-promise').Promise; // jshint ignore:line
var defaultFilename = path.resolve(process.cwd(), '.snyk');

module.exports = {
  load: load,
  save: save,
};

var defaultVersion = 'v1';
var latestParser = function (d) { return d; };

// eventually we'll have v2 which will point to latestParser, and v1 will
// need to process the old form of data and upgrade it to v2 structure
var parsers = {
  v1: latestParser,
};

function parse(data) {
  if (!data.version) {
    data.version = defaultVersion;
  }

  if (!parsers[data.version]) {
    data.version = defaultVersion;
  }

  return parsers[data.version](data);
}

function load(root) {
  var filename = root ? path.resolve(root, '.snyk') : defaultFilename;

  return fs.readFile(filename, 'utf8').then(function (yamlContent) {
    return parse(yaml.safeLoad(yamlContent));
  });
}

function save(object, root) {
  var filename = root ?
    path.resolve(root, '.snyk') :
    defaultFilename;

  return new Promise(function (resolve) {
    object.version = defaultVersion;
    resolve(yaml.safeDump(object));
  }).then(function (yaml) {
    return fs.writeFile(filename, yaml);
  });
}