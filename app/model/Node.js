define(function(require) {

  var Backbone  = require('backbone');
  var check     = require('check');

  var Node = Backbone.Model.extend({
    idAttribue : 'id',
    initialize : function(options) {
      check(options.id).isString();
    }
  }, {
    STATE : {
      VISITED : 1,
      PENDING : 2,
      PROCESSING : 3
    }
  });

  return Node;

});
