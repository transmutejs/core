module.exports = (grunt) => {

  // Start grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Enable JSHint coverage
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    all: ['gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
    options: {
      node: true,
      esversion: 6,
      strict: false,
      globals: {
        describe: false,
        it: false,
        lang: false,
        plural: false
      }
    }
  });

  // Enable test runner
  grunt.loadNpmTasks('grunt-run');
  grunt.config('run', {
    test: {
      exec: 'npm test'
    },
    coverage: {
      exec: 'npm run coverage'
    }
  });

  // Watch for file changes
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    test: {
      files: ['app/**/*.js', 'test/**/*.js'],
      tasks: ['jshint', 'run:test']
    },
  });

};