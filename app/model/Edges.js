define(function(require) {

  var check     = require('check');
  var Edge      = require('./Edge');
  var Backbone  = require('backbone');

  var Edges = Backbone.Collection.extend({
    model : Edge
  });

  return Edges;

});
