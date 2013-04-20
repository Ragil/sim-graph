/**
 * This routing table for the application.
 */
define(function(require) {

  var MainView  = require('view/MainView');
  var Backbone  = require('backbone');
  var BFSView   = require('view/algo/BFSView');
  var Graph     = require('model/Graph');
  var Nodes     = require('model/Nodes');
  var Node      = require('model/Node');
  var Edges     = require('model/Edges');

  var Router = Backbone.Router.extend({
    initialize : function() {
      this.mainView = new MainView();
    },

    routes : {
      '*actions' : 'all'
    },

    all : function() {
      var view = new BFSView({
        model : Graph.randomTree(10)
      });
      this.mainView.setLayout(view);
      view.render();
    }
  });

 return Router;
});
