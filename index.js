var http = require('http');
var webhookHandler = require('github-webhook-handler');
var handler = webhookHandler({ path: "/deploy", secret: "james" });

http.createServer(function (req, res) {
  res.statusCode = 200;
  res.end("hello world");
}).listen(1996, function() {
  console.log("listening on 1996");
});
