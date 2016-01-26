var http = require('http');
var webhookHandler = require('github-webhook-handler');
var yaml = require('js-yaml');
var fs = require('fs');

var handler = webhookHandler({ path: "/deploy", secret: "james" });

(function() {
  var DEPLOY_PORT, DEPLOY_PATH, DEPLOY_SECRET;

  function readConfig(callback) {
    try {
      var doc = yaml.safeLoad(fs.readFileSync('.deploy.yml', 'utf8'));
      console.log(doc);

      if (doc.config !== undefined && doc.config.port !== undefined &&
        doc.config.path !== undefined && doc.config.secret !== undefined) {
          DEPLOY_PORT = doc.config.port;
          DEPLOY_PATH = doc.config.path;
          DEPLOY_SECRET = doc.config.secret;
      } else {
        callback({
          message: "Malformed .deploy.yml."
        });
      }
    } catch (e) {
      var msg = e;

      if (e.code == "ENOENT") {
        msg = "Cannot find .deploy.yml";
      }

      callback({
        message: msg
      });
    }
  }

  readConfig(function(err, data) {
    if (err) {
      console.log(err.message);
    }
  });
})();

/*
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(1996, function() {
  console.log("listening on 1996");
});

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
});
*/
