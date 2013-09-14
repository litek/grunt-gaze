'use strict';
var path = require("path"),
    server = require("./lib/server"),
    gaze = require("gaze");

module.exports = function(grunt) {
  var callbacks = {};

  grunt.registerTask("gaze", function(target) {
    var key = target || "*", done = this.async();
    if (typeof(callbacks[key]) !== "undefined") {
      callbacks[key] = done;
      return;
    }

    callbacks[key] = done;
    var targets = grunt.config(this.name);
    var options = this.options({
      livereload: false
    });

    var watch = [], match = [], cwd = process.cwd();

    grunt.util._.each(targets, function(val, key) {
      if (target && key !== target) return;
      if (key === "options" || !val.files) return;
      if (!val.tasks && (!val.options || !val.options.livereload)) return;

      if (!(val.files instanceof Array)) val.files = [val.files];
      if (!val.options) val.options = {};

      grunt.util._.defaults(val.options, options);

      if (val.options.livereload) {
        var port = typeof(val.options.livereload) === "number" ? val.options.livereload : 35729;
        val.options.livereload = server(port);
      }

      val.files = val.files.map(function(pattern) {
        return path.relative(cwd, pattern);
      });

      watch.push.apply(watch, val.files);
      match.push(val);
    });

    watch.forEach(function(p) {
      grunt.log.writeln("Watching %s", p);
    });

    // watch
    gaze(watch, function(err, watcher) {
      if (err) return grunt.warn(err);

      this.on("all", function(event, absolute) {
        var filepath = path.relative(cwd, absolute);

        match.forEach(function(val, key) {
          if (grunt.file.isMatch(val.files, filepath)) {
            if (val.tasks && val.tasks.length) {
              grunt.log.writeln("Change in '%s' triggers [%s]%s", filepath, val.tasks.join(", "), val.options.livereload ? " with livereload" : "");

              var async = target ? "gaze:"+target : "gaze";
              grunt.task.run(val.tasks.concat([async]));
              callbacks[target || "*"]();
            } else {
              grunt.log.writeln("Change in '%s' triggers livereload", filepath);
            }

            if (val.options.livereload) {
              val.options.livereload.trigger(filepath);
            }
          }
        });
      });
    });
  });
};
