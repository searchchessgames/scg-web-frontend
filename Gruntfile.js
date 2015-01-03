'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['styles.scss'],
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },

        csso: {
            dist: {
                files: {
                    'dist/css/styles.min.css': 'dist/css/styles.css',
                }
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:dist', 'csso:dist'],
                options: {
                    debounceDelay: 100,
                },
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:js'],
                options: {
                    debounceDelay: 100,
                },
            },
            html: {
                files: ['src/html/**/*.html'],
                tasks: ['htmlmin'],
                options: {
                    debounceDelay: 100,
                },
            },
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/simple/**'],
                        dest: 'dist/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/simple/images/*'],
                        dest: 'dist/images',
                        filter: 'isFile'
                    },
                ]
            }
        },

        concat: {
            js: {
                files: {
                    'dist/frontend.js': [
                        'src/js/lib/angular.js',
                        'src/js/lib/angular-ui-router.js',
                        'src/js/controllers/*.js',
                        'src/js/directives/*.js',
                        'src/js/*.js',
                    ],
                }
            },
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/base.html': 'src/html/base.html',
                    'dist/index.html': 'src/html/index.html',
                    'dist/search.html': 'src/html/search.html',
                    'dist/game.html': 'src/html/game.html',
                }
            },
        },

        'ftp-deploy': {
            deploy: {
                auth: {
                  host: 'searchchessgames.com',
                  port: 21
                },
                src: 'dist',
                dest: 'scg-web',
                exclusions: []
            },
        }
    });

    grunt.registerTask('default', [
        'dist',
        'watch',
    ]);

    grunt.registerTask('dist', [
        'sass:dist',
        'csso:dist',
        'copy:dist',
        'concat:js',
        'htmlmin:dist',
    ]);

    grunt.registerTask('deploy', [
        'dist',
        'ftp-deploy',
    ]);
};
