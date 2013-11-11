'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.initConfig({
    jshint: {
      options: {
        node: true,
        globalstrict: true
      },
      all: ["Gruntfile.js", "tasks/**/*.js", "!tasks/lib/vendor/livereload.js"]
    }
  });

  grunt.registerTask("default", ["jshint"]);
};
