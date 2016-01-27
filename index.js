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

  function openHook(port, path, secret) {
    var handler = webhookHandler({ path: path, secret: secret });

    http.createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location');
      });
    }).listen(port, function() {
      console.log("listening on *:" + port);
    });

    handler.on('error', function (err) {
      console.error('Error:', err.message);
    });

    handler.on('push', function (event) {
      console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);

      runScript();
    });

    handler.on('ping', function (event) {
      console.log('Ping has been received... ' + event.payload.zen);

      runScript();
    });
  }

  readConfig(function(err, data) {
    if (err) {
      console.log(err.message);
    } else {
      openHook(data.port, data.path, data.secret);
    }
  });
})();
