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
```
