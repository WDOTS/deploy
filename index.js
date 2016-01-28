var http = require('http');
var yaml = require('js-yaml');
var fs = require('fs');
var spawn = require('child_process').spawn;
var chimneypot = require('chimneypot');

(function() {
  function readConfig(callback) {
    try {
      var doc = yaml.safeLoad(fs.readFileSync('.deploy.yml', 'utf8'));
      if (doc.config !== undefined && doc.config.port !== undefined &&
        doc.config.path !== undefined && doc.config.secret !== undefined) {
          callback(undefined, doc.config);
      } else {
        callback("Malformed .deploy.yml.", undefined);
      }
    } catch (e) {
      callback(e, undefined);
    }
  }

  readConfig(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var pot = new chimneypot({
        port: data.port,
        path: data.path,
        secret: data.secret
      });

      pot.route('push', function (event) {
        spawn('sh', ['pull.sh']);
      });

      pot.listen();
    }
  });
})();
