var http = require('http');
var webhookHandler = require('github-webhook-handler');
var yaml = require('js-yaml');
var fs = require('fs');

var handler = webhookHandler({ path: "/deploy", secret: "james" });

(function() {
  function readConfig(callback) {
    try {
      var doc = yaml.safeLoad(fs.readFileSync('.deploy.yml', 'utf8'));
      console.log(doc);
    } catch (e) {
      callback(e);
    }
  }

  readConfig(function(err) {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Cannot find .deploy.yml");
      } else {
        console.log(err);
      }
    }
  });
})();

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
