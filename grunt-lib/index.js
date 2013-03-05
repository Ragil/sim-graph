module.exports = function(grunt) {
    grunt.task.registerMultiTask("index", "Generate index.html", function() {
        var conf = this.data;
        var tmpl = grunt.file.read(conf.src);

        if (tmpl && conf.dest) {
            grunt.file.write(conf.dest, grunt.template.process(tmpl,
                {data : conf.data}));

            grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src
                    + '\'');
        } else {
            grunt.log.error('Cannot generate index : tmpl ' + tmpl + ' dest ' + conf.dest);
            grunt.warn(new Error('Template not found'));
        }
    });
};
