define(function(require) {

  var Backbone  = require('backbone');
  var d3        = require('d3');
  var check     = require('check');
  var Node      = require('model/Node');

  var NodeView = Backbone.View.extend({
    model : Node,
    initialize : function(options) {
      check(options.model).isOfType(Node);
      check(options.svg[0])
        .each(function(val, key) { return !isNaN(parseInt(key, 10)); })
        .isOfType(SVGSVGElement);

      this.node = options.svg.append('circle');

      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      this.node
        .attr('cx', this.model.get('left'))
        .attr('cy', this.model.get('top'))
        .attr('r', this.model.get('radius'))
        .attr('fill', 'red');
    }
  });

  return NodeView;
});
