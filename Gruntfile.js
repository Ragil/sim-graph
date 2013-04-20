module.exports = function(grunt) {

  var hash = (new Date()).getTime();

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    clean : {
      code : ['temp', 'cover'],
      dist : ['dist'],
      local : ['dist/local'],
      prod : ['dist/prod']
    },

    jshint : {
      all : ['Gruntfile.js', 'app/**/*.js', 'test/spec/**/*.js'],
      options : {
        browser : true,
        laxbreak : true,
        curly : true,
        eqeqeq : true,
        immed : true,
        latedef : true,
        newcap : true,
        noarg : true,
        sub : true,
        boss : true,
        eqnull : true,
        loopfunc : true
      }
    },

    copy : {
      code : {
        files : {
          'temp/' : ['app/**', 'test/**']
        }
      },
      cover : {
        files : {
          'cover/' : ['app/**', 'test/**']
        }
      }
    },

    cover : {
      compile : {
        files : {
          'cover/' : 'app/**/*.js'
        }
      }
    },

    mocha : {
      index : ['test/index.html']
    },

    less : {
      uncompressed : {
        options : {
          paths : ['components/bootstrap/less', 'components/less-elements']
        },
        files : {
          'dist/local/css/app.css' : 'temp/app/view/MainView.less'
        }
      },
      compressed : {
        options : {
          paths : ['components/bootstrap/less', 'components/less-elements'],
          compress : true
        },
        files : (function() {
          var res = {};
          res['dist/prod/css/app' + hash + '.css'] =
              'temp/app/view/MainView.less';
          return res;
        })()
      }
    },

    watch : {
      code : {
        files : ['app/**', 'test/**'],
        tasks : 'dist:local'
      }
    },

    requirejs: {
      local : {
        options : {
          almond : true,
          include : 'config.js',
          baseUrl : 'temp/app/',
          mainConfigFile : 'temp/app/config.js',
          insertRequire : ['main'],
          out : 'dist/local/js/app.js',
          optimize : 'none'
        },
        path : {
          env : 'temp/app/env/local.js'
        }
      },

      prod : {
        options : {
          almond : true,
          include : 'config.js',
          baseUrl : 'temp/app/',
          mainConfigFile : 'temp/app/config.js',
          insertRequire : ['main'],
          out : 'dist/prod/js/app' + hash + '.js'
        },
        path : {
          env : 'temp/app/env/prod.js'
        }
      }
    },

    index : {
      local : {
        src : 'index.html',
        dest : 'dist/local/index.html',
        data : {
          css : 'app',
          js : 'app'
        }
      },
      prod : {
        src : 'index-prod.html',
        dest : 'dist/prod/index.html',
        data : {
          css : 'app' + hash,
          js : 'app' + hash
        }
      }
    }

  });

  grunt.loadTasks('grunt-lib');

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-mocha');

  // helper tasks
  grunt.registerTask('coverage', ['copy:cover', 'cover']);
  grunt.registerTask('test', ['coverage', 'mocha']);
  grunt.registerTask('compile', ['clean:code', 'copy:code', 'jshint', 'test']);

  // dist tasks
  grunt.registerTask('dist:local', ['clean:local',
      'compile', 'less:uncompressed', 'index:local', 'requirejs:local']);
  grunt.registerTask('dist:prod', ['clean:prod',
      'compile', 'less:compressed', 'index:prod', 'requirejs:prod']);
  grunt.registerTask('dist:all', ['clean', 'dist:local', 'dist:prod']);

  // default
  grunt.registerTask('default', ['clean', 'dist:local', 'watch']);
};
