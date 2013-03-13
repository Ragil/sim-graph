define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var NodeView  = require('./NodeView');
  var d3        = require('d3');

  /**
   * Renders a graph using svg.
   */
  var GraphView = Backbone.View.extend({
    className : 'graphView',
    tagName : 'div',
    model : Graph,
    initialize : function(options) {
      check(options.model).isOfType(Graph);

      this.svg = d3.select(this.$el[0]).append('svg');
      this.drawn = {};

      this.model.get('nodes').on('reset add remove', this.render, this);
      this.model.get('edges').on('reset add remove', this.render, this);
      this.model.on('change:width change:height', this.render, this);
    },

    render : function() {
      // clean container
      this.svg.attr('width', this.model.get('width'))
          .attr('height', this.model.get('height'));
      this.drawNodes();
    },

    drawNodes : function() {
      // find nodes that need to be drawn and the set of all nodes that
      // is allowed to be drawn
      var validNodes = {};
      this.model.get('nodes').each(_.bind(function(node) {
        if (!this.drawn[node.id]) {
          this.drawn[node.id] = node;
          validNodes[node.id] = node;
          new NodeView({ model : node, svg : this.svg });
        }
      }, this));

      // find and remove nodes that need to be removed
      _.each(this.drawn, function(node, nodeId) {
        if (!validNodes[nodeId]) {
          this.$(nodeId).remove();
        }
      });
    }
  });

  return GraphView;
});
