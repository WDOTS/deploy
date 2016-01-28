var yaml = require('js-yaml');
var fs = require('fs');
var spawn = require('child_process').spawn;
var chimneypot = require('chimneypot');

(function() {
  function getConfig() {
    var doc = yaml.safeLoad(fs.readFileSync('.deploy.yml', 'utf8'));

    if (doc.config !== undefined && doc.config.port !== undefined &&
      doc.config.path !== undefined && doc.config.secret !== undefined) {
        return doc.config;
    }
  }

  var config = getConfig();

  var pot = new chimneypot({
    port: config.port,
    path: config.path,
    secret: config.secret
  });

  pot.route('push', function(event) {
    spawn('sh', ['pull.sh']);
  });

  pot.listen();
})();
