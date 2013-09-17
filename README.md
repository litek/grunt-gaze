# grunt-gaze

A simpler, faster watcher for grunt with livereload.

## Sample configuration
Compiles LESS file and triggers livereload when css file is written

```javascript
grunt.initConfig({
  less: {
    web: {
      files: {
        "dist/web.css": "css/web.less"
      }
    }
  },

  gaze: {
    less: {
      files: ["css/*.less"],
      tasks: ["less"]
    },
    livereload: {
      files: ["dist/*"],
      options: {
        livereload: true
      }
    }
  }
});

grunt.registerTask("default", ["less", "gaze"]);
```
## Server
Also includes a simple execution wrapper for your development server (gazed)

```javascript
grunt.initConfig({
  gazed: {
    dev: {
      args: "--harmony app.js",
      env: {
        NODE_PATH: process.cwd()
      }
    }
  },

  "gaze": {
    server: {
      files: ["app.js", "routes/**/*.js"],
      tasks: ["gazed"]
    }
  }
});

grunt.registerTask("default", ["gazed", "gaze"]);
```
