define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('./Graph');

  /**
   * Renders a graph using svg.
   */
  var GraphView = Backbone.View.extend({
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);
    }
  });

  return GraphView;
});
