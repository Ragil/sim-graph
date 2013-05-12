define(function(require) {

  var _ = require('underscore');
  var check = require('check');
  var Backbone = require('backbone');
  var BFSOperation = require('model/BFSOperation');
  var template = require('text!./BFSOperationView.html');
  var Node = require('model/Node');
  var Edge = require('model/Edge');

  var BFSOperationView = Backbone.View.extend({
    className : 'bfsOperationView',
    model : BFSOperation,
    initialize : function(options) {
      check(options.model).isOfType(BFSOperation);

      this.$el.html(_.template(template, {
        queue : '[' + this.model.get('queue').toString() + ']',
        task : this.getTask(this.model)
      }));
    },

    getTask : function(operation) {
      switch (operation.get('type')) {
        case BFSOperation.TYPE.NODE:
          return this.getNodeTask(operation);
        case BFSOperation.TYPE.EDGE:
          return this.getEdgeTask(operation);
      }
    },

    getNodeTask : function(operation) {
      var nodeId = operation.get('operand').id;
      switch (operation.get('state')) {
        case Node.STATE.PENDING :
          return 'Add ' + nodeId;
        case Node.STATE.PROCESSING :
          return 'Process ' + nodeId;
        case Node.STATE.VISITED :
          return 'Mark ' + nodeId + ' complete';
      }
      throw new Error('cannot find operation');
    },

    getEdgeTask : function(operation) {
      var edgeId = operation.get('operand').id;
      switch(operation.get('state')) {
        case Edge.STATE.TRAVERSING:
          return 'Explore edge ' + edgeId;
        case Edge.STATE.TRAVERSED:
          return 'Mark ' + edgeId + ' complete';
      }
      throw new Error('cannot find operation');
    }
  });

  return BFSOperationView;
});
