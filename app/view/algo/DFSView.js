define(function(require) {
  var Backbone = require('backbone');
  var check = require('check');
  var ExplorationView = require('./ExplorationView');
  var ExploreOperations = require('model/ExploreOperations');
  var DFSAlgo = require('./DFSAlgo');
  var Graph = require('model/Graph');

  var DFSView = Backbone.View.extend({
    tagName : 'div',
    className : 'dfsView',
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);
      check(options.mode).isNumber();

      this.exploreView = new ExplorationView({
        model : options.model,
        sequence : new ExploreOperations(
            DFSAlgo.getExecSequence(options.model, options.mode))
      });

      this.$el.append(this.exploreView.$el);
    },

    render : function() {
      this.exploreView.render();
    }
  });

  return DFSView;
});
