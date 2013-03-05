/**
 * The entry point of the application.
 */
define(function(require) {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var Router = require('Router');

    $(document).ready(function() {
        new Router();
        Backbone.history.start({
            pushState : true,
            root : '/app/'
        });
    });

});
