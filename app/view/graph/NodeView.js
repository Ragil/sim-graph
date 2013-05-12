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
      this.text = options.svg.append('text')
        .text(this.model.id);

      this.model.on('change', this.render, this);
      this.render();
    },

    render : function() {
      // reset css
      this.node.attr('class', '');

      this.node
        .classed('node', true)
        .attr('id', this.model.id)
        .attr('cx', this.model.get('left'))
        .attr('cy', this.model.get('top'))
        .attr('r', this.model.get('radius'));

      this.text
        .classed('node-text', true)
        .attr('x', this.model.get('left') - 5)
        .attr('y', this.model.get('top') + 5);

      switch(this.model.get('state')) {
        case Node.STATE.PENDING :
          this.node.classed('pending', true);
          break;
        case Node.STATE.PROCESSING :
          this.node.classed('processing', true);
          break;
        case Node.STATE.VISITED :
          this.node.classed('visited', true);
          break;
      }
    }
  });

  return NodeView;
});
