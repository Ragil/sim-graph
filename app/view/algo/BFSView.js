define(function(require) {

  var _         = require('underscore');
  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var Node      = require('model/Node');

  var BFSOperation = Backbone.Model.extend({
    initialize : function(options) {
      // clone everything
      this.set({
        queue : _.map(options.queue, function(val) { return val; }),
        operand : options.operand,
        action : options.action || function() {},
        raction : options.raction || function() {}
      });

      this.set({
        action : _.bind(this.get('action'), this),
        raction : _.bind(this.get('raction'), this)
      });
    },

    exec : function() {
      this.get('action')(this.get('operand'));
    },
    undo : function() {
      this.get('raction')(this.get('operand'));
    }
  }, {
    nodeOperation : function(queue, node, state) {
      var op = new BFSOperation({
        queue : queue,
        operand : node,
        action : function(operand) {
          this.set('prevState', operand.get('state'));
          operand.set('state', state);
        },
        raction : function(operand) {
          operand.set('state', this.get('prevState'));
        }
      });
      return op;
    }
  });

  var BFSView = Backbone.View.extend({
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);

      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      var sequence = this.getExecSequence();
      var count = 0;
      var next = function() {
        sequence[count].exec();
        count++;

        if (count < sequence.length) {
          setTimeout(next, 500);
        }
      };

      next();
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
