var http = require('http');
var webhookHandler = require('github-webhook-handler');
var yaml = require('js-yaml');
var fs = require('fs');
var spawn = require('child_process').spawn;

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

      spawn('sh', ['pull.sh']);
    });

    handler.on('ping', function (event) {
      console.log('Ping has been received... ' + event.payload.zen);

      spawn('sh', ['pull.sh']);
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
