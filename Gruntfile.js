/*!
    * Copyright (c) 2016, naveenkumarpg.com, All rights reserved.
    * Name of the file "gruntfile.js"
    * This file contains the code for automation of minification and compression page creation script tasks
    *
    * @project   open source project for front-end developement
    * @date      2016-09-10
    * @author    Naveen Kumar PG, Gmail <naveenkumarpg@gmail.com>
    * @licensor  naveenkumarpg.com
    * @site      http://www.naveenkumarpg.com/
*/


module.exports = function(grunt) {

    'use strict';

    require( 'time-grunt' )( grunt );

    var uglify, watch;

    uglify = {
        global: {
            // Minifying header, login, search into global.min.js file
            // Planning to add common functionalities to global.min.js
            'site/js/global.min.js': [
                'js/libs/jquery-3.1.0.js',
            ]
        },
        modules: {
            // Minifying all js files availabe in js folder excluding libs
            // and files included in global.min.js
            expand: true,
            cwd: 'js/',
            src: [
                '**/*.js',
                '!*.min.js',
                '!libs/*.js',
            ],
            dest: 'site/js/',
            ext: '.min.js'
        }
    };

    watch = {
        css: ['css/*/*.scss'],
        js: [
            'js/**/*.js',
            '!js/libs/**'
        ],
        hbs:['src/*/*.hbs'],
        data:['data/*.json']
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'temp/css/main.css': 'css/main.scss'
                }
            }
        },
        assemble: {
            options: {
                layout: "src/layouts/default.hbs",
                flatten: true,
                partials: 'src/partials/*.hbs',
                layout: 'default.hbs',
                layoutdir: 'src/layouts',
                data: 'data/*.{json,yml}',
            },
            pages: {
                files: {
                    'site/': ['src/pages/**/*.hbs']
                }
            }
        },
        // File arrays (uglify.global/uglify.modules) declared at top of scope
        uglify: {
            options: {
                sourceMap: true
            },
            global: {
                files: [ uglify.global ]
            },
            modules: {
                files: [ uglify.modules ]
            },
            dist: {
                options: {
                    sourceMap: false
                },
                files: [
                    uglify.global,
                    uglify.modules
                ]
            }
        },
        cssmin: {
            my_target: {
                files: [ {
                    // Compressing main.css file into main.min.css
                    expand: true,
                    cwd: 'temp/css',
                    src: [ 'main.css' ],
                    dest: 'site/css',
                    ext: '.min.css'
                } ]
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'site/css/main.min.css',
                        'site/**/*.html',
                        'site/js/*/*.min.js',
                        'data/*/*.json'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './',
                    directory: true
                }
            }
        },
        // Watch files declared at top of scope. See `watch` object
        watch: {
            options: {
                livereload: true
            },
            cssDev: {
                files: watch.css,
                tasks: [
                    'sass:dist'
                ]
            },
            cssDist: {
                files: watch.css,
                tasks: [
                    'sass:dist',
                    'cssmin'
                ]
            },
            hbs: {
                files: watch.hbs,
                tasks: ['assemble']
            },
            jsDev: {
                files: watch.js,
                tasks: [
                    'newer:uglify:global',
                    'newer:uglify:modules'
                ]
            },
            jsDist: {
                files: watch.js,
                tasks: [
                    'newer:uglify:dist'
                ]
            }
        },
        focus: {
            dev: {
                include: [
                    'cssDev',
                    'jsDev'
                ]
            },
            dist: {
                include: [
                    'cssDist',
                    'jsDist',
                    'hbs'
                ]
            }
        }

    });
    grunt.loadNpmTasks('assemble');

    // Importing browser sync
    grunt.loadNpmTasks( 'grunt-browser-sync' );

    // Importing uglify
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    // Importing sass
    grunt.loadNpmTasks( 'grunt-sass' );

    // Importing cssmin
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

    // Watch for css and js files
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // Focus and run a subset of watch targets
    grunt.loadNpmTasks( 'grunt-focus' );

    // Run tasks only on newly changed files
    grunt.loadNpmTasks( 'grunt-newer' );

    // Default task runner
    grunt.registerTask( 'dist', [ 'sass:dist', 'uglify:dist', 'cssmin' ] );

    grunt.registerTask('default', ['browserSync', 'focus:dist', 'assemble']);
};
