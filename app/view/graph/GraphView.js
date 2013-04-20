define(function(require) {

  var check     = require('check');
  var Backbone  = require('backbone');
  var Graph     = require('model/Graph');
  var NodeView  = require('./NodeView');
  var EdgeView  = require('./EdgeView');
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
      this.drawnN = {}; // nodes.id -> nodes that are drawn
      this.drawnE = {}; // edge.id -> edges that are drawn

      this.model.get('nodes').on('reset add remove', this.render, this);
      this.model.get('edges').on('reset add remove', this.render, this);
      this.model.on('change:width change:height', this.render, this);

      this.render();
    },

    render : function() {
      // clean container
      this.svg.attr('width', this.model.get('width'))
          .attr('height', this.model.get('height'));
      this.drawNodes();
      this.drawEdges();
    },

    drawEdges : function() {
      var validEdges = {};
      this.model.get('edges').each(function(edge) {
        if (!this.drawnE[edge.id]) {
          this.drawnE[edge.id] = edge;
          validEdges[edge.id] = true;
          new EdgeView({ model : edge, svg : this.svg });
        }
      }, this);
    },

    drawNodes : function() {
      var validNodes = {};
      this.model.get('nodes').each(_.bind(function(node) {
        if (!this.drawnN[node.id]) {
          this.drawnN[node.id] = node;
          validNodes[node.id] = true;
          new NodeView({ model : node, svg : this.svg });
        }
      }, this));
    }
  }, {
    get : function(graph) {
      return new GraphView({ model : graph });
    }
  });

  return GraphView;
});
