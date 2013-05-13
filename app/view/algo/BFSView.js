define(function(require) {

  var _         = require('underscore');
  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var Node      = require('model/Node');
  var Edge      = require('model/Edge');
  var GraphView = require('view/graph/GraphView');
  var template  = require('text!./BFSView.html');
  var ExploreOperation = require('model/ExploreOperation');
  var ExploreOperationView = require('./ExploreOperationView');
  var OperationsPlayerView = require('./OperationsPlayerView');
  var Operation = require('model/Operation');
  var Operations = require('model/Operations');

  var STATE = {
    PLAY : 1,
    STOP : 2
  };

  var BFSView = Backbone.View.extend({
    className : 'bfsView',
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);

      options.model.set('width', 600);
      options.model.set('height', 600);
      options.model.computeGraphPos();

      this.operationView = OperationsPlayerView.get(
          this.generateOperations());

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

    generateOperations : function() {
      var sequence = _.map(this.getExecSequence(), function(operand) {
        return new Operation({
          operand : operand,
          view : new ExploreOperationView({ model : operand })
        });
      });

      return new Operations(sequence);
    },

    getExecSequence : function() {
      var sequence = [];
      var visited  = {};
      var queue    = [];
      var edgeList = this.model.get('edgeList');
      var nodes    = this.model.get('nodes');

      sequence.push(new ExploreOperation({
        queue : queue
      }));

      // adding root nodes
      this.model.get('rootNodes').each(function(node) {
        queue.push(node.id);
        sequence.push(ExploreOperation.nodeOperation(queue, node,
            Node.STATE.PENDING));
      });

      while (queue.length > 0) {
        var node = nodes.get(queue.shift());
        sequence.push(ExploreOperation.nodeOperation(queue, node,
            Node.STATE.PROCESSING));

        visited[node.id] = true;

        // process children
        _.each(edgeList[node.id], function(childId) {
          if (!visited[childId]) {

            // traverse edge
            var edge = this.model.findEdge(node.id, childId);
            sequence.push(ExploreOperation.edgeOperation(queue, edge,
                Edge.STATE.TRAVERSING));

            var next = this.model.get('nodes').get(childId);
            queue.push(next.id);
            sequence.push(ExploreOperation.nodeOperation(queue, next,
                Node.STATE.PENDING));

            // traversed edge
            sequence.push(ExploreOperation.edgeOperation(queue, edge,
                Edge.STATE.TRAVERSED));
          }
        }, this);

        sequence.push(ExploreOperation.nodeOperation(queue, node,
            Node.STATE.VISITED));
      }

      return sequence;
    }
  });

  return BFSView;
});
