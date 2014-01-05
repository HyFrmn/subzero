// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-preprocess'); 
    grunt.initConfig({
        // The clean task ensures all files are removed from the dist/ directory so
        // that no files linger from previous builds.
        clean: [".tmp/"],

        concat: {
            "js/subzero.js" : ["vendor/require.js", ".tmp/app.js"],
            "options" : {
                process : function(content, srcpath){
                    content = content.replace(/\$\$BUILD_DATE/, grunt.template.today('yyyy-mm-dd'))
                    return content;
                }
            }
        },

        // This task uses James Burke's excellent r.js AMD build tool.  In the
        // future other builders may be contributed as drop-in alternatives.
        requirejs: {
            compile: {
                options: {
                    baseUrl: "src/",
                    name: 'subzero',
                    out: ".tmp/app.js",
                    //dir: "build/",
                    optimize: "none",
                    packages: ['sge','subzero'],
                    shim: {

                    }
                }
            }
        },

        // This task creates a zip file of the final production assets ready 
        // to upload to the cloud compile or to test on a device.
        compress: {
            main: {
                options: {
                    archive: "game.zip"
                },
                files: [{src: 'content/**'},{src: 'js/*'},{src: 'vendor/*'},{src: 'index.html'}]
            }
        },

        // This taks removes debug statements from production builds.
        preprocess : {
            options: {
                inline: true,
                context : {
                    DEBUG: false
                }
            },
            js : {
                src: '.tmp/app.js'
            }
        },
    });
    grunt.registerTask("default", ["requirejs", "preprocess", "concat", "compress"]);
}