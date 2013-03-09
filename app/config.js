require.config({
    baseUrl : 'app/',
    deps : [ 'main' ],
    paths : {

        // directory prefixes
        test : '../test',

        // external libs
        jquery : '../../components/jquery/jquery',
        underscore : '../../components/underscore/underscore',
        backbone : '../../components/backbone/backbone',
        bootstrap : '../../comonents/bootstrap/docs/assets/js/bootstrap',
        text : '../../components/requirejs-text/text',
        mocha : '../../components/mocha/mocha',
        expect : '../../components/expect/expect',
        sinon : '../../components/sinon/sinon',
        check : '../../components/checkjs/lib/check',

        // environment settings
        env : 'env/local',

        // frequently used components
        eventBus : 'util/eventBus'

    },

    shim : {
        backbone : {
            deps : [ 'underscore', 'jquery' ],
            exports : 'Backbone'
        },
        underscore : {
            exports : '_'
        },
        mocha : {
            exports : 'mocha'
        }
    }

});

var runMocha = function() {
    mocha.run(function() {
        if (typeof window.__$coverObject !== 'undefined') {
            var reporter = new JSCovReporter({
                coverObject : window.__$coverObject
            });
        }
    });
};

