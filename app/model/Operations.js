define(function(require) {

  var Backbone = require('backbone');
  var Operation = require('./Operation');

  var Operations = Backbone.Collection.extend({
    model : Operation
  });

  return Operations;
});
