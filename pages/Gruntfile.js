// Generated on 2014-05-28 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	//require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({
		globalConfig:{
		  dest: '../server/public'
		 },
		// Watches files for changes and runs tasks based on the changed files
		watch : {
			js : {
				files : [ 'app/scripts/{,*/}*.js' ],
				tasks : [ 'dist' ],
				options : {
					livereload : true
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish')
			},
			all : [ 'Gruntfile.js', 'app/scripts/{,*/}*.js' ]
		},

		// Empties folders to start fresh
		clean : {
			dist : {
				files : [ {
					dot : true,
					src : [ '<%= globalConfig.dest %>/*' ]
				} ]
			}
		},
		//installation des dépendances bower
		bower: {
		    install: {
		    }
		},
	
		concat : {
			application : {
				src : [ 'app/scripts/app.js', 'app/scripts/directives/*.js',
						'app/scripts/filters/*.js', 'app/scripts/controllers/**/*.js',
						'app/scripts/directives/**/*.js', 'app/scripts/**/*.js' ],
				dest : '<%= globalConfig.dest %>/js/app.js'
			},
			vendors: {
				src: [
					'app/bower_components/angular/angular.js',
					'app/bower_components/angular-resource/angular-resource.js',
					'app/bower_components/angular-route/angular-route.js'],
				dest: '<%= globalConfig.dest %>/js/vendor.js'
			}
		},
		less : {
			all : {
				options : {
					yuicompress : true
				},
				files : {
					"<%= globalConfig.dest %>/css/collman.css" : "app/less/main.less"
				}
			}
		},

		// Copies remaining files to places other tasks can use
		copy : {
			dist : {
				files : [ {
					expand : true,
					dot : true,
					cwd : 'app/',
					dest : '<%= globalConfig.dest %>/',
					src : [ '*.{ico,png,txt}', '.htaccess', '*.html',
							'views/{,*/}*.html', 'images/{,*/}*.{webp}',
							'fonts/*' ]
				} ]
			}
		}
	});

	// register
	grunt.registerTask('dist', [ 'concat', 'less', 'copy:dist', ]);

	grunt.registerTask('build', [ 'clean:dist', 'bower:install', 'dist' ]);

	grunt.registerTask('default', [ 'build' ]);
};
