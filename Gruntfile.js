
'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({

    // grunt-contrib-watch
    // watch for file changes
    watch: {
      sass: {
        files: 'app/styles/*.{scss,sass}',
        tasks: ['sass:dist']
      },
      livereload: {
        files: ['app/styles/*.css', 
                'app/scripts/**/*.js',
                'app/**/*.html'
               ],
        options: {
        livereload: true
        }
      }
    },

    // grunt-contrib-connect
    // Runs dev server
    connect: {
      options: {
        port: 9001,
        hostname: 'localhost',
        livereload: 35729
      },
      dev: {
        options: {
          open: true,
          base: 'app'  
        }
      }
    },

    // grunt-contrib-sass
    // compiles sass to css
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/styles',
          src: ['*.scss'],
          dest: 'app/styles',
          ext: '.css'
        }]
      }
    }

  });

  grunt.registerTask('serve', function(target) {
    grunt.task.run([
      'connect:dev',
      'watch'
    ]);
  });

};