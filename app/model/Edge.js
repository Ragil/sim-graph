define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var Node      = require('./Node');

  var Edge = Backbone.Model.extend({
    initialize : function(options) {
      check(options.src).isOfType(Node);
      check(options.dest).isOfType(Node);

      this.id = options.src.id + '->' + options.dest.id;
    }
  }, {
    STATE : {
      TRAVERSING : 1,
      TRAVERSED : 2
    }
  });

  return Edge;
});
