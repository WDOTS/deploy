var http = require('http');
var yaml = require('js-yaml');
var fs = require('fs');
var spawn = require('child_process').spawn;
var chimneypot = require('chimneypot');

(function() {
  function readConfig() {
    var doc = yaml.safeLoad(fs.readFileSync('.deploy.yml', 'utf8'));

    if (doc.config !== undefined && doc.config.port !== undefined &&
      doc.config.path !== undefined && doc.config.secret !== undefined) {
        return doc.config;
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
