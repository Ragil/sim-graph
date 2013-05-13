define(function(require) {
  var Backbone = require('backbone');
  var check = require('check');
  var ExplorationView = require('./ExplorationView');
  var ExploreOperations = require('model/ExploreOperations');
  var BFSAlgo = require('./BFSAlgo');
  var Graph = require('model/Graph');

  var BFSView = Backbone.View.extend({
    tagName : 'div',
    className : 'bfsView',
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);

      this.exploreView = new ExplorationView({
        model : options.model,
        sequence : new ExploreOperations(
            BFSAlgo.getExecSequence(options.model))
      });

      this.$el.append(this.exploreView.$el);
    },

    render : function() {
      this.exploreView.render();
    }
  });

  return BFSView;
});
