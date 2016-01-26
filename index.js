var http = require('http');

http.createServer(function (req, res) {
  res.statusCode = 200;
  res.end("hello world");
}).listen(1996, function() {
  console.log("listening on 1996");
});
