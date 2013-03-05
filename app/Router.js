/**
 * This routing table for the application.
 */
define(function(require) {

    var MainView = require('view/MainView');
    var Backbone = require('backbone');

    var Router = Backbone.Router.extend({

        initialize : function() {
            this.mainView = new MainView();
        },

        routes : {
        }

    });

    return Router;

});
