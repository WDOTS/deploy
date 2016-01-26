var http = require('http');
var webhookHandler = require('github-webhook-handler');
var handler = webhookHandler({ path: "/deploy", secret: "james" });

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  });
}).listen(1996, function() {
  console.log("listening on 1996");
});

handler.on('error', function (err) {
  console.error('Error:', err.message)
});
