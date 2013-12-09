// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.initConfig({
        // The clean task ensures all files are removed from the dist/ directory so
        // that no files linger from previous builds.
        clean: [".tmp/"],

        concat: {
            "js/subzero.js" : ["node_modules/requirejs/require.js",".tmp/app.js"],
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
                        'sge/vendor/caat' : {
                            exports: 'CAAT'
                        },
                        'sge/vendor/underscore' : {
                            exports: '_'
                        }
                    }
                }
            }
        }
    });
    grunt.registerTask("default", ["requirejs", "concat"]);
}