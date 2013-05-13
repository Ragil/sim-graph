define(function(require) {

  var _ = require('underscore');
  var check = require('check');
  var Backbone = require('backbone');
  var ExploreOperation = require('model/ExploreOperation');
  var template = require('text!./ExploreOperationView.html');
  var Node = require('model/Node');
  var Edge = require('model/Edge');

  var ExploreOperationView = Backbone.View.extend({
    className : 'exploreOperationView',
    model : ExploreOperation,
    initialize : function(options) {
      check(options.model).isOfType(ExploreOperation);

      this.$el.html(_.template(template, {
        queue : '[' + this.model.get('queue').toString() + ']',
        task : this.getTask(this.model)
      }));
    },

    getTask : function(operation) {
      switch (operation.get('type')) {
        case ExploreOperation.TYPE.NODE:
          return this.getNodeTask(operation);
        case ExploreOperation.TYPE.EDGE:
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

  return ExploreOperationView;
});
