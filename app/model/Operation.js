define(function(require) {
  var Backbone = require('backbone');
  var check = require('check');

  var Operation = Backbone.Model.extend({
    initialize : function(options) {
      check(options.operand).isDefined();
      check(options.operand.exec).msg('operand must have an exec function')
          .isFunction();
      check(options.operand.undo).msg('operand must have an undo function')
          .isFunction();
      check(options.view).isDefined();
    },

    exec : function() {
      this.get('operand').exec();
    },

    undo : function() {
      this.get('operand').undo();
    }
  });

  return Operation;
});
