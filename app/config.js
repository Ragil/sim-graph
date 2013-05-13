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
        sinon : '../../lib/sinon-1.7.1',
        check : '../../components/checkjs/lib/check',
        d3 : '../../components/d3/d3',
        'jquery.svg' : '../../components/jquery.svg/jquery.svg',

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
        d3 : {
            exports : 'd3'
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

