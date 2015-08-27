module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: "/*! <%= pkg.filename %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
        mangle: {toplevel: true},
        squeeze: {dead_code: false},
        codegen: {quote_keys: true}
      },
      build: {
		    files: {
			    'dist/js/<%= pkg.filename %>.min.js':'src/js/<%=pkg.filename %>.js',
			    'dist/js/user-message.min.js':'src/js/user-message.js'
		    }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ]
    },
    concat: {
      options: {
        separator: '',
        stripBanners: true
      },
      css:{
        src: [
          'tmp/css/*.css'
        ],
        dest: 'dist/css/<%=pkg.filename %>.min.css'
      },
      allinone_css:{
        src: [
          'bower_components/bootstrap-dropdown-submenu/dist/css/bootstrap-dropdown-submenu.min.css',
          'bower_components/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
          'bower_components/bootstrap-colorpicker-plus/dist/css/bootstrap-colorpicker-plus.min.css',
          'bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
          'bower_components/bootstrap-shapestyle-dialog/dist/css/bootstrap-ssdlg.min.css',
          'bower_components/jquery-imagerect/dist/css/jquery-imagerect.min.css',
          'dist/css/bootstrap-jh2d-editor.min.css'
        ],
        dest: 'dist/css/allinone.min.css'
      },
      allinone_js:{
        src: [
          'bower_components/jquery.hotkeys/jquery.hotkeys.js',
          'bower_components/node-uuid/uuid.js',
          'bower_components/qrcodejs/qrcode.min.js',
          'bower_components/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js',
          'bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
          'bower_components/jquery-imagerect/dist/js/jquery-imagerect.min.js',
          'bower_components/bootstrap-colorpicker-plus/dist/js/bootstrap-colorpicker-plus.min.js',
          'bower_components/bootstrap-shapestyle-dialog/dist/js/bootstrap-ssdlg.min.js',
          'bower_components/jh2d/dist/jh2d.min.js',
          'dist/js/bootstrap-jh2d-editor.min.js'
        ],
        dest: 'dist/js/allinone.min.js'
      }
    },
    copy: {
      bootstrap_shapestyle_dialog: {
        expand: true,
        cwd: 'bower_components/bootstrap-shapestyle-dialog/dist/img/',
        src: '**/*',
        dest:'dist/img/'
      },
      mjolnic_bootstrap_colorpicker: {
        expand: true,
        cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist/img/',
        src: ['**/*'],
        dest:'dist/img/'
      },
      bootstrap_jh2d_editor: {
        expand: true,
        cwd: 'src/img/',
        src: ['**/*'],
        dest:'dist/img/'
      }
    },
	  cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
		    files: {
			    'tmp/css/<%= pkg.filename %>.min.css':'src/css/<%=pkg.filename %>.css',
          'tmp/css/<%= pkg.filename %>-icon.min.css':'src/css/<%=pkg.filename %>-icon.css'
		    }
      }
	  },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
	    files: [{       
          expand: true,
		  cwd: 'tmp',
		  src: '**/*.html',
		  dest: 'dist'
		}]
      }
    },
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 7,
          pngquant: true
        },
        files: [
          {expand: true, cwd: 'src', src: ['img/*.{png,jpg,jpeg,gif,webp,svg}'], dest: 'dist'}
        ]
      }
    },
    clean: ['dist','tmp'],
    dotpl: {
      options: {
        main:'src/tpl/index.html'
      },
	  main: {
		options: {
			renderer: function(k, v) {
				if(k==='bootstrap_ssdlg') {
				  var p = 'bower_components/bootstrap-shapestyle-dialog/dist/tpl/';
				  var name = 'bootstrap-ssdlg.min.html';
				  switch(this.ctx.dest) {
				    case 'tmp/index_zh-CN.html':
					  name = 'bootstrap-ssdlg_zh_cn.min.html';
					break;
				    case 'tmp/index_zh-TW.html':
					  name = 'bootstrap-ssdlg_zh_tw.min.html';
					break;
				  }
				  v = grunt.file.read(p+name);
				}
				return v;
			}
		},
        files: {
          'tmp/index.html': ['src/lang/en-US/main.json'],
          'tmp/index_zh-CN.html': ['src/lang/zh-CN/main.json'],
          'tmp/index_zh-TW.html': ['src/lang/zh-TW/main.json']
        }
	  }
    },
    cipher: {
      options: {
        pk:grunt.cli.options.pk||grunt.file.read('.pk')
      },
      encrypt: {
        files: [{
          expand:true,
          src:['src/**/*','res/**/*'],
          dest:'cipher/'
        }]
      },      
      decrypt: {
        options: {
          method:'decrypt'
        },
        files: [{
          expand:true,
          cwd:'cipher/',
          src:['**/*'],
          dest:'./'
        }]
      }
    }
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('test', ['jshint','dotpl','uglify','cssmin','concat:css','htmlmin']);
  grunt.registerTask('decrypt', ['cipher:decrypt']);
  grunt.registerTask('encrypt', ['cipher:encrypt']);
  grunt.registerTask('default', ['jshint','clean','cipher:encrypt','uglify','cssmin','concat:css']);
  grunt.registerTask('release', ['concat:allinone_css', 'concat:allinone_js', 'copy', 'dotpl', 'htmlmin']);
};