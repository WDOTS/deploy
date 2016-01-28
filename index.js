var http = require('http');
var webhookHandler = require('github-webhook-handler');
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
        callback({
          message: "Malformed .deploy.yml."
        }, undefined);
      }
    } catch (e) {
      var msg = e;

      if (e.code == "ENOENT") {
        msg = "Cannot find .deploy.yml";
      }

      callback({
        message: msg
      }, undefined);
    }
  }

  function runScript() {
    var sh = spawn('sh', ['pull.sh']);

    sh.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    sh.stderr.on('data', function (data) {
      console.log("ERROR!!!:");
      console.log(data.toString());
    });

    sh.on('close', function (code) {
      console.log("script exited with code: " + code);
    });
  }

  readConfig(function(err, data) {
    if (err) {
      console.log(err.message);
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
