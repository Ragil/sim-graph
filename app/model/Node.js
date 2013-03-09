define(function(require) {

  var Backbone  = require('backbone');
  var check     = require('check');

  var Node = Backbone.Model.extend({
    idAttribue : 'id',
    initialize : function(options) {
      check(options.id).isString();
    }
  });

  return Node;

});
