define(function(require) {

  var _         = require('underscore');
  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var Node      = require('model/Node');
  var GraphView = require('view/graph/GraphView');
  var template  = require('text!./BFSView.html');
  var BFSOperation = require('model/BFSOperation');
  var BFSOperationView = require('./BFSOperationView');

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

      this.$el.html(template);
      this.$graph = this.$('.graph');
      this.$log = this.$('.log');
      this.$graph.append(new GraphView({ model : options.model }).$el);

      this.locks = {};
      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      // stop all plays
      _.each(this.locks, function(state, lock) {
        this.locks[lock] = STATE.STOP;
      }, this);

      this.play();
    },

    play : function() {
      // aquire lock
      var lock = Math.random().toString();
      this.locks[lock] = STATE.PLAY;

      var sequence = this.getExecSequence();
      var count = 0;
      var next = _.bind(function() {
        var state = this.locks[lock];

        if (state === STATE.PLAY) {
          var operation = sequence[count++];
          operation.exec();
          this.$log.append(new BFSOperationView({ model : operation }).$el);

          if (count < sequence.length) {
            setTimeout(next, 500);
          }
        } else if (state === STATE.STOP) {
          // clean up
          delete this.locks[lock];
        }
      }, this);

      setTimeout(next, 500);
    },

    getExecSequence : function() {
      var sequence = [];
      var visited  = {};
      var queue    = [];
      var edgeList = this.model.get('edgeList');
      var nodes    = this.model.get('nodes');

      sequence.push(new BFSOperation({
        queue : queue
      }));

      // adding root nodes
      this.model.get('rootNodes').each(function(node) {
        queue.push(node.id);
        sequence.push(BFSOperation.nodeOperation(queue, node,
            Node.STATE.PENDING));
      });

      while (queue.length > 0) {
        var node = nodes.get(queue.shift());
        sequence.push(BFSOperation.nodeOperation(queue, node,
            Node.STATE.PROCESSING));

        visited[node.id] = true;

        // process children
        _.each(edgeList[node.id], function(childId) {
          if (!visited[childId]) {
            var next = this.model.get('nodes').get(childId);
            queue.push(next.id);
            sequence.push(BFSOperation.nodeOperation(queue, next,
                Node.STATE.PENDING));
          }
        }, this);

        sequence.push(BFSOperation.nodeOperation(queue, node,
            Node.STATE.VISITED));
      }

      return sequence;
    }
  });

  return BFSView;
});
