'use strict';
var express = require("express"),
    WS = require("ws").Server,
    livereload = require("fs").readFileSync(__dirname+"/vendor/livereload.js", "utf8"),
    servers = {};

module.exports = function(port) {
  if (typeof(servers[port]) !== "undefined") {
    return servers[port];
  }

  var app = express();
  app.get("/livereload.js", function(req, res) {
    res.set("Content-Type", "application/javascript");
    res.send(livereload);
  });

  var server = app.listen(port);
  var wss = new WS({server: server});
  var sockets = [];

  wss.on("connection", function(socket) {
    sockets.push(socket);
    socket.send(JSON.stringify({
      command: "hello",
      protocols: [
        "http://livereload.com/protocols/official-7",
        "http://livereload.com/protocols/official-8",
        "http://livereload.com/protocols/official-9"
      ]
    }));

    socket.on("close", function() {
      var idx = sockets.indexOf(socket);
      if (idx >= 0) {
        sockets.splice(idx, 1);
      }
    });
  });

  var trigger = function(file) {
    sockets.forEach(function(socket) {
      socket.send(JSON.stringify({
        command: "reload",
        path: file,
        liveCSS: true
      }));
    });
  };

  servers[port] = {trigger: trigger};

  return servers[port];
};
