/**
 * This routing table for the application.
 */
define(function(require) {

  var MainView  = require('view/MainView');
  var Backbone  = require('backbone');
  var BFSView   = require('view/algo/BFSView');
  var DFSView   = require('view/algo/DFSView');
  var DFSAlgo   = require('view/algo/DFSAlgo');
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
      var mode = this.param('mode');
      switch(algo) {
        case 'bfs': this.bfs(); break;
        case 'dfs': this.dfs(mode); break;
      }
    },

    dfs : function(mode) {
      mode = parseInt(mode, 10);
      var view = new DFSView({
        model : Graph.randomTree(10),
        mode : mode
      });
      this.mainView.setLayout(view);
    },

    bfs : function() {
      var view = new BFSView({
        model : Graph.randomTree(10)
      });
      this.mainView.setLayout(view);
    }
  });

 return Router;
});
