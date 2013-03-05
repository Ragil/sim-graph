module.exports = function(grunt) {

    grunt.registerMultiTask('thrift', 'Compiles thrift files', function() {

        var languages = this.data.languages;
        var files = this.data.files;
        var out = this.data.out;

        grunt.log.writeln('Thrift for ' + files);

        // create a variable to wait for thriftgen because it is async
        var completed = 0;
        var done = this.async();

        // thrift gen for each language
        languages.forEach(function(language) {

            // thirft gen for each file
            files.forEach(function(file) {
                var args = [];

                if (out) {
                    args.push('-o');
                    args.push(out);
                }

                args.push('--gen');
                args.push(language);
                args.push(file);

                grunt.log.writeln('thrift ' + args.join(' '));

                var spawn = require('child_process').spawn;
                var thrift = spawn('thrift', args);

                thrift.stderr.on('data', function(data) {
                    grunt.log.error('stderr : ' + data);
                    grunt.warn(new Error(
                            'Cannot compile one or more thrift files.'));
                });

                thrift.on('exit', function(code) {
                    completed++;
                    if (completed >= files.length) {
                        done();
                    }
                });
            });
        });

    });

};
