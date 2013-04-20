define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');

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
    TYPE : {
      NODE : 1,
      EDGE : 2
    },
    nodeOperation : function(queue, node, state) {
      var op = new BFSOperation({
        type : BFSOperation.TYPE.NODE,
        queue : queue,
        operand : node,
        state : state,
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

  return BFSOperation;
});
