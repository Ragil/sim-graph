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

    param : function(name){
      var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)')
          .exec(window.location.href);
      return results && results.length > 0 ? results[1] : undefined;
    },

    routes : {
      '*actions' : 'all'
    },

    all : function() {
      var algo = this.param('algo');
      switch(algo) {
        case 'bfs': this.bfs(); break;
      }
    },

    bfs : function() {
      var view = new BFSView({
        model : Graph.randomTree(10)
      });
      this.mainView.setLayout(view);
      view.render();
    }
  });

 return Router;
});
