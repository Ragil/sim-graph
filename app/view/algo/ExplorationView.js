define(function(require) {

  var _         = require('underscore');
  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var Node      = require('model/Node');
  var Edge      = require('model/Edge');
  var GraphView = require('view/graph/GraphView');
  var template  = require('text!./ExplorationView.html');
  var ExploreOperation = require('model/ExploreOperation');
  var ExploreOperations = require('model/ExploreOperations');
  var ExploreOperationView = require('./ExploreOperationView');
  var OperationsPlayerView = require('./OperationsPlayerView');
  var Operation = require('model/Operation');
  var Operations = require('model/Operations');

  var STATE = {
    PLAY : 1,
    STOP : 2
  };

  var ExplorationView = Backbone.View.extend({
    className : 'explorationView',
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);
      check(options.sequence).isOfType(ExploreOperations);

      options.model.set('width', 600);
      options.model.set('height', 600);
      options.model.computeGraphPos();

      this.operationView = OperationsPlayerView.get(
          this.generateOperations(options.sequence));

      this.$el.html(template);
      this.$graph = this.$('.graph');
      this.$graph.append(new GraphView({ model : options.model }).$el);
      this.$log = this.$('.log');
      this.$log.append(this.operationView.$el);

      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      this.operationView.play();
    },

    generateOperations : function(sequence) {
      var result = sequence.map(function(operand) {
        return new Operation({
          operand : operand,
          view : new ExploreOperationView({ model : operand })
        });
      });

      return new Operations(result);
    }
  });

  return ExplorationView;
});
