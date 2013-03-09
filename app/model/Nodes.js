define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var Node      = require('./Node');

  var Nodes = Backbone.Collection.extend({
    model : Node
  });

  return Nodes;

});
